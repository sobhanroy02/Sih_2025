#!/usr/bin/env node

// Database migration script for CitiZen application
// This script helps manage database schema changes and updates

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'database', 'migrations');
const SCHEMA_FILE = path.join(__dirname, '..', 'database', 'complete-schema.sql');
const SAMPLE_DATA_FILE = path.join(__dirname, '..', 'database', 'sample-data.sql');

class DatabaseMigration {
  constructor() {
    this.ensureMigrationsDir();
  }

  ensureMigrationsDir() {
    if (!fs.existsSync(MIGRATIONS_DIR)) {
      fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
      console.log(`Created migrations directory: ${MIGRATIONS_DIR}`);
    }
  }

  generateTimestamp() {
    const now = new Date();
    return now.toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '')
      .replace('T', '_');
  }

  createMigration(name) {
    if (!name) {
      console.error('Migration name is required');
      console.log('Usage: npm run migrate:create <migration_name>');
      return;
    }

    const timestamp = this.generateTimestamp();
    const filename = `${timestamp}_${name.replace(/\s+/g, '_').toLowerCase()}.sql`;
    const filepath = path.join(MIGRATIONS_DIR, filename);

    const template = `-- Migration: ${name}
-- Created: ${new Date().toISOString()}
-- Description: Add your migration description here

-- =============================================
-- UP Migration (apply changes)
-- =============================================

-- Add your SQL statements here
-- Example:
-- ALTER TABLE public.issues ADD COLUMN new_field TEXT;
-- CREATE INDEX idx_new_field ON public.issues(new_field);

-- =============================================
-- DOWN Migration (rollback changes)
-- =============================================

-- Add rollback SQL statements here (commented out)
-- Example:
-- DROP INDEX IF EXISTS idx_new_field;
-- ALTER TABLE public.issues DROP COLUMN IF EXISTS new_field;

-- =============================================
-- Notes
-- =============================================

-- 1. Test this migration on a copy of your database first
-- 2. Backup your database before running in production
-- 3. Consider the impact on existing data
-- 4. Update any affected API endpoints or queries
`;

    fs.writeFileSync(filepath, template);
    console.log(`Created migration: ${filename}`);
    console.log(`Path: ${filepath}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Edit the migration file to add your SQL statements');
    console.log('2. Test the migration on a development database');
    console.log('3. Run: npm run migrate:apply to apply the migration');
  }

  listMigrations() {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('No migrations found');
      return;
    }

    console.log('Available migrations:');
    files.forEach((file, index) => {
      const filepath = path.join(MIGRATIONS_DIR, file);
      const stats = fs.statSync(filepath);
      console.log(`${index + 1}. ${file} (${stats.size} bytes, ${stats.mtime.toISOString()})`);
    });
  }

  generateFullSetup() {
    console.log('Generating complete database setup script...');
    
    let setupScript = `-- Complete Database Setup for CitiZen Application
-- Generated: ${new Date().toISOString()}
-- Run this script in your Supabase SQL Editor

-- =============================================
-- MAIN SCHEMA
-- =============================================

`;

    // Add main schema
    if (fs.existsSync(SCHEMA_FILE)) {
      setupScript += fs.readFileSync(SCHEMA_FILE, 'utf8');
      setupScript += '\n\n';
    }

    // Add migrations
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length > 0) {
      setupScript += `-- =============================================
-- MIGRATIONS
-- =============================================

`;
      
      migrationFiles.forEach(file => {
        const migrationContent = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
        setupScript += `-- Migration: ${file}\n`;
        setupScript += migrationContent;
        setupScript += '\n\n';
      });
    }

    // Add sample data
    setupScript += `-- =============================================
-- SAMPLE DATA (Optional - for development)
-- =============================================

`;

    if (fs.existsSync(SAMPLE_DATA_FILE)) {
      setupScript += fs.readFileSync(SAMPLE_DATA_FILE, 'utf8');
    }

    const outputFile = path.join(__dirname, '..', 'database', 'full-setup.sql');
    fs.writeFileSync(outputFile, setupScript);
    
    console.log(`Generated complete setup script: ${outputFile}`);
    console.log('');
    console.log('Instructions:');
    console.log('1. Copy the contents of full-setup.sql');
    console.log('2. Paste it into your Supabase SQL Editor');
    console.log('3. Run the script to set up your complete database');
  }

  showUsage() {
    console.log('Database Migration Tool for CitiZen');
    console.log('');
    console.log('Usage:');
    console.log('  npm run migrate:create <name>  - Create a new migration');
    console.log('  npm run migrate:list           - List all migrations');
    console.log('  npm run migrate:setup          - Generate complete setup script');
    console.log('');
    console.log('Examples:');
    console.log('  npm run migrate:create add_priority_field');
    console.log('  npm run migrate:create update_user_roles');
    console.log('');
    console.log('Files:');
    console.log(`  Schema: ${SCHEMA_FILE}`);
    console.log(`  Sample Data: ${SAMPLE_DATA_FILE}`);
    console.log(`  Migrations: ${MIGRATIONS_DIR}`);
  }
}

// CLI Interface
const migration = new DatabaseMigration();
const command = process.argv[2];
const argument = process.argv[3];

switch (command) {
  case 'create':
    migration.createMigration(argument);
    break;
  case 'list':
    migration.listMigrations();
    break;
  case 'setup':
    migration.generateFullSetup();
    break;
  default:
    migration.showUsage();
}
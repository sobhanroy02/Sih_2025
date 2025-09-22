// Database connection test for CitiZen application
// This script tests the Supabase connection and basic functionality

import { createClient } from '@supabase/supabase-js'

// Test configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function testSupabaseConnection() {
  log('\n🔍 Testing Supabase Database Connection...', colors.bold)
  
  // Check environment variables
  log('\n1. Checking environment variables...', colors.blue)
  
  if (!config.supabaseUrl) {
    log('❌ NEXT_PUBLIC_SUPABASE_URL is not set', colors.red)
    return false
  }
  
  if (!config.supabaseKey) {
    log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set', colors.red)
    return false
  }
  
  if (!config.serviceRoleKey) {
    log('⚠️  SUPABASE_SERVICE_ROLE_KEY is not set (optional for basic testing)', colors.yellow)
  }
  
  log('✅ Environment variables configured', colors.green)
  
  // Test basic connection
  log('\n2. Testing basic connection...', colors.blue)
  
  try {
    const supabase = createClient(config.supabaseUrl!, config.supabaseKey!)
    
    // Test simple query
    const { data, error } = await supabase
      .from('departments')
      .select('count(*)')
      .limit(1)
    
    if (error) {
      log(`❌ Connection failed: ${error.message}`, colors.red)
      return false
    }
    
    log('✅ Basic connection successful', colors.green)
    
  } catch (error) {
    log(`❌ Connection error: ${error}`, colors.red)
    return false
  }
  
  // Test table structure
  log('\n3. Testing table structure...', colors.blue)
  
  const supabase = createClient(config.supabaseUrl!, config.supabaseKey!)
  
  const tables = [
    'users',
    'departments', 
    'issues',
    'issue_comments',
    'issue_votes',
    'workers',
    'notifications',
    'analytics'
  ]
  
  let tablesExist = 0
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        log(`❌ Table '${table}' not accessible: ${error.message}`, colors.red)
      } else {
        log(`✅ Table '${table}' exists and accessible`, colors.green)
        tablesExist++
      }
    } catch (error) {
      log(`❌ Error checking table '${table}': ${error}`, colors.red)
    }
  }
  
  // Test PostGIS extension
  log('\n4. Testing PostGIS extension...', colors.blue)
  
  if (config.serviceRoleKey) {
    try {
      const serviceSupabase = createClient(config.supabaseUrl!, config.serviceRoleKey)
      
      const { data, error } = await serviceSupabase
        .rpc('check_postgis_extension')
        .single()
      
      if (error) {
        log('⚠️  PostGIS extension check failed (this is normal if not set up yet)', colors.yellow)
      } else {
        log('✅ PostGIS extension is available', colors.green)
      }
    } catch (error) {
      log('⚠️  Could not check PostGIS extension', colors.yellow)
    }
  } else {
    log('⚠️  Service role key needed to check PostGIS extension', colors.yellow)
  }
  
  // Test storage buckets
  log('\n5. Testing storage buckets...', colors.blue)
  
  const buckets = ['issue-images', 'avatars', 'department-assets']
  
  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .list('', { limit: 1 })
      
      if (error) {
        log(`❌ Bucket '${bucket}' not accessible: ${error.message}`, colors.red)
      } else {
        log(`✅ Bucket '${bucket}' exists and accessible`, colors.green)
      }
    } catch (error) {
      log(`❌ Error checking bucket '${bucket}': ${error}`, colors.red)
    }
  }
  
  // Summary
  log('\n📊 Connection Test Summary', colors.bold)
  log(`Tables accessible: ${tablesExist}/${tables.length}`)
  
  if (tablesExist === tables.length) {
    log('\n🎉 All tests passed! Your database is ready.', colors.green + colors.bold)
    log('\n💡 Next steps:', colors.blue)
    log('   1. Run: npm run dev')
    log('   2. Visit: http://localhost:3000')
    log('   3. Test the application features')
    return true
  } else {
    log('\n⚠️  Some tables are missing. You may need to run the database setup.', colors.yellow + colors.bold)
    log('\n💡 To fix this:', colors.blue)
    log('   1. Copy database/complete-schema.sql content')
    log('   2. Paste it in your Supabase SQL Editor')
    log('   3. Run the script')
    log('   4. Run this test again: npm run db:test')
    return false
  }
}

// Self-executing async function
if (require.main === module) {
  testSupabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      log(`\n❌ Unexpected error: ${error}`, colors.red)
      process.exit(1)
    })
}

export default testSupabaseConnection
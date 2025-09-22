# 🚀 Complete Supabase Setup Guide for CitiZen

This guide will walk you through setting up your complete Supabase database for the CitiZen application.

## 📋 Prerequisites

1. **Supabase Account**: Create at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18+ installed
3. **Git**: For version control

## 🎯 Quick Setup (5 Minutes)

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `citizen-app` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project initialization (2-3 minutes)

### Step 2: Get Your Credentials

1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL**
   - **anon public key**
   - **service_role key** (keep this secret!)

### Step 3: Configure Environment

1. Copy `.env.template` to `.env.local`:
   ```bash
   cp .env.template .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Step 4: Set Up Database

1. **Open Supabase SQL Editor**:
   - Go to your Supabase dashboard
   - Click **SQL Editor** in the sidebar

2. **Copy & Run the Complete Schema**:
   - Open `database/complete-schema.sql` in your project
   - Copy ALL the content
   - Paste it into the Supabase SQL Editor
   - Click **Run** (this will take 30-60 seconds)

3. **Add Sample Data** (Optional):
   - Open `database/sample-data.sql`
   - Copy and paste into SQL Editor
   - Click **Run**

### Step 5: Test Your Setup

```bash
# Validate environment configuration
npm run env:validate

# Test database connection
npm run db:test

# Start development server
npm run dev
```

## 🛠️ Detailed Configuration

### Database Extensions

The schema automatically enables these extensions:
- **uuid-ossp**: UUID generation
- **postgis**: Geospatial features for location tracking
- **pg_stat_statements**: Performance monitoring

### Storage Buckets

These buckets are automatically created:
- **issue-images**: For uploading issue photos
- **avatars**: For user profile pictures  
- **department-assets**: For department resources

### Row Level Security (RLS)

All tables have RLS enabled with these policies:
- **Users**: Can view all, update own profile
- **Issues**: Public read, authenticated create, owner/admin update
- **Comments**: Public read, authenticated create, owner update
- **Votes**: Public read, authenticated vote, owner update
- **Notifications**: Private to user

### Real-time Features

These tables have real-time enabled:
- `issues` - Live issue updates
- `issue_comments` - Live comment updates  
- `notifications` - Live notifications
- `issue_votes` - Live vote counts

## 🗺️ Mumbai Ward Configuration

The database includes Mumbai's 24 administrative wards:

1. **A Ward** - Colaba, Cuffe Parade
2. **B Ward** - Dongri, Mazgaon
3. **C Ward** - V.T., Azad Maidan
4. **D Ward** - Grant Road, Malabar Hill
5. **E Ward** - Byculla, Masjid Bunder
6. **F/N Ward** - Parel, Sewri
7. **F/S Ward** - Parel
8. **G/N Ward** - Dadar, Mahim
9. **G/S Ward** - Worli, Lower Parel
10. **H/E Ward** - Bandra East
11. **H/W Ward** - Bandra West
12. **K/E Ward** - Andheri East
13. **K/W Ward** - Andheri West, Juhu
14. **L Ward** - Kurla
15. **M/E Ward** - Chembur
16. **M/W Ward** - Chembur West
17. **N Ward** - Ghatkopar
18. **P/N Ward** - Malad
19. **P/S Ward** - Goregaon
20. **R/C Ward** - Borivali
21. **R/N Ward** - Dahisar
22. **R/S Ward** - Kandivali
23. **S Ward** - Bhandup, Mulund
24. **T Ward** - Mulund East

## 📧 Email Configuration (Optional)

For notifications, configure SMTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Gmail Setup**:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password as `SMTP_PASS`

## 🔐 Authentication Setup

Supabase Auth is pre-configured with:
- **Email/Password**: Enabled by default
- **Email Confirmations**: Recommended for production
- **JWT Settings**: Auto-configured

**Optional Providers**:
1. Go to **Authentication** > **Providers**
2. Enable Google, GitHub, etc.
3. Add OAuth credentials

## 🚀 Production Deployment

### Vercel Deployment

1. **Connect Repository**:
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repo to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Update Environment**:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

### Database Backup

```sql
-- Create backup
pg_dump -h your-db-host -U postgres your-db-name > backup.sql

-- Restore backup  
psql -h your-db-host -U postgres your-db-name < backup.sql
```

## 🔧 Troubleshooting

### Common Issues

1. **"relation does not exist"**
   - Run the complete schema script
   - Check if all tables were created

2. **"JWT secret not found"**
   - Set `JWT_SECRET` in environment variables
   - Must be 32+ characters

3. **"Storage bucket not found"**
   - Run the storage bucket creation SQL
   - Check bucket policies

4. **PostGIS functions not working**
   - Ensure PostGIS extension is enabled
   - Restart your application

### Verification Commands

```bash
# Check environment
npm run env:validate

# Test database connection
npm run db:test

# Check specific table
# In Supabase SQL Editor:
SELECT COUNT(*) FROM issues;
SELECT COUNT(*) FROM users;
```

### Database Reset (Development Only)

```sql
-- WARNING: This deletes all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Then run complete-schema.sql again
```

## 📚 Additional Resources

- **API Documentation**: `BACKEND_README.md`
- **Dependencies**: `DEPENDENCIES.md`
- **Sample Data**: `database/sample-data.sql`
- **Migration Scripts**: `scripts/migrate.js`

## 🎉 You're All Set!

Your CitiZen database is now ready with:
- ✅ Complete schema with 8 main tables
- ✅ PostGIS geospatial features
- ✅ Row Level Security policies
- ✅ Storage buckets for file uploads
- ✅ Real-time subscriptions
- ✅ Mumbai ward boundaries
- ✅ Sample data for testing

Start your application:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and start building! 🚀
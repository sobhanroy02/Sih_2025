# Complete Supabase Database Setup Guide for CitiZen

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase
3. Get your project URL and anon key from Settings > API

## Step 1: Environment Configuration

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Upload Configuration
UPLOAD_MAX_SIZE=10485760

# AI Classification (Optional)
CLASSIFICATION_API_KEY=your-ai-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 2: Database Setup Instructions

### A. Enable Extensions
Run this in Supabase SQL Editor first:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
```

### B. Run Main Schema
Copy and paste the complete schema from `database/complete-schema.sql` into Supabase SQL Editor.

### C. Insert Sample Data
After schema is created, run the sample data from `database/sample-data.sql`.

## Step 3: Storage Setup

### Create Storage Buckets
Run this in Supabase SQL Editor:

```sql
-- Create storage bucket for issue images
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-images', 'issue-images', true);

-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create storage bucket for department assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('department-assets', 'department-assets', true);
```

### Storage Policies
```sql
-- Policy for issue images - users can upload and view
CREATE POLICY "Users can upload issue images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view issue images" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-images');

-- Policy for avatars - users can manage their own
CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 4: Authentication Setup

Supabase Auth is automatically configured. Enable the following providers in Supabase Dashboard:
- Email (enabled by default)
- Google (optional)
- GitHub (optional)

### Auth Settings
- Go to Authentication > Settings
- Enable "Enable email confirmations" for production
- Set Site URL to your domain
- Configure redirect URLs

## Step 5: Real-time Configuration

Enable real-time for specific tables:
```sql
-- Enable real-time for issues table
ALTER PUBLICATION supabase_realtime ADD TABLE issues;

-- Enable real-time for notifications table  
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable real-time for issue_comments table
ALTER PUBLICATION supabase_realtime ADD TABLE issue_comments;
```

## Step 6: API Configuration

Your API endpoints will automatically work with the database once environment variables are set.

### Test Database Connection
```bash
# Start your development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/issues
```

## Step 7: Production Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy

### Environment Variables for Production
Update these for production:
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `SMTP_*` - Production email service
- `JWT_SECRET` - Strong production secret

## Troubleshooting

### Common Issues
1. **Connection Error**: Check if environment variables are correct
2. **PostGIS Error**: Ensure PostGIS extension is enabled
3. **Storage Error**: Verify storage buckets are created with correct policies
4. **Auth Error**: Check if JWT_SECRET is set and Supabase keys are correct

### Verify Setup
```sql
-- Check if extensions are enabled
SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'postgis');

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables WHERE schemaname = 'public';
```

## Database Migration Commands

For future updates, use these commands:
```bash
# Create new migration
npx supabase migration new migration_name

# Apply migrations
npx supabase db push

# Reset database (development only)
npx supabase db reset
```

This setup provides a complete, production-ready database for your CitiZen application with all necessary security policies, storage configuration, and real-time features.
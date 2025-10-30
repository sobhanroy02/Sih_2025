# 🗄️ Database Setup & Data Flow Guide

## Complete Step-by-Step Setup

This guide will help you set up the database and ensure data flows correctly from forms to the database.

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Sign Up" or "Sign In"
3. Click "New Project"
4. Fill in details:
   - **Name**: `citizen-app` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users (e.g., Asia - Singapore)
5. Click "Create new project"
6. Wait for project to initialize (2-3 minutes)

---

## Step 2: Get Your Credentials

1. Go to your project dashboard
2. Click **Settings** (bottom left)
3. Click **API**
4. Copy these values:
   - **Project URL** - Copy this
   - **anon public** - Copy this (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role secret** - Copy this (SUPABASE_SERVICE_ROLE_KEY)

---

## Step 3: Create Environment File

1. In VS Code, open the project root directory
2. Create a new file named `.env.local` (if it doesn't exist)
3. Paste this content and replace with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

✅ **Important**: Don't commit `.env.local` to git (it's in `.gitignore`)

---

## Step 4: Set Up Database Schema

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste the entire contents of `database/complete-schema.sql`
4. Click **Run** (top right)
5. Wait for the script to complete (30-60 seconds)

**What this does**:
- Creates all necessary tables (users, issues, comments, votes, etc.)
- Sets up indexes for performance
- Enables PostGIS for location features
- Creates automatic timestamp updates

---

## Step 5: Add Sample Data (Optional)

1. In SQL Editor, click **New Query**
2. Paste contents of `database/sample-data.sql`
3. Click **Run**

This adds test data to help you see how the app works.

---

## Step 6: Configure Storage Buckets

1. Go to **Storage** (left sidebar)
2. Click **Create New Bucket**
3. Name it: `issue-attachments`
4. Click **Create**
5. Repeat for these buckets:
   - `avatars` - for user profile pictures
   - `department-assets` - for department resources

**For each bucket**:
1. Click on the bucket
2. Click **Policies** tab
3. Click **New Policy**
4. Select **For authenticated users**
5. Set **Allowed operations**: SELECT, INSERT, UPDATE, DELETE
6. Click **Save**

---

## Step 7: Install Dependencies

Run in terminal:
```bash
cd /path/to/Sih_2025
npm install
```

---

## Step 8: Start the Application

Run:
```bash
npm run dev
```

Open browser to: `http://localhost:3000`

---

## Data Flow: How Data Reaches the Database

### Flow Diagram
```
User fills form
       ↓
Frontend validates input
       ↓
API endpoint called (e.g., POST /api/issues)
       ↓
Server validates with Zod schema
       ↓
Supabase authentication check
       ↓
Data inserted into database
       ↓
Response sent back to frontend
       ↓
UI updated with confirmation
```

---

## Example: Creating an Issue (Report Form)

### 1. User fills the form:
```
Title: "Pothole on Main Street"
Description: "Large pothole causing damage"
Category: "Pothole / Road Damage"
Severity: "High"
Location: Uses GPS or manual address
Photos: Uploaded
```

### 2. User clicks "Submit Report"

### 3. Frontend sends to API:
```typescript
POST /api/issues
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing damage",
  "category": "Road & Infrastructure",
  "priority": "high",
  "location": { "latitude": 19.0760, "longitude": 72.8777 },
  "address": "Main Street, Mumbai",
  "attachments": [{ "file_url": "...", "file_type": "image" }]
}
```

### 4. Backend API:
- ✅ Validates all fields
- ✅ Checks user is logged in
- ✅ Uploads files to Supabase Storage
- ✅ Inserts record into `issues` table
- ✅ Creates analytics event
- ✅ Returns success response

### 5. Data appears in Supabase:
- Go to **SQL Editor**
- Run: `SELECT * FROM issues ORDER BY created_at DESC LIMIT 10;`
- You'll see your issue!

---

## Testing: Verify Everything Works

### Test 1: Create Account
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Fill in details:
   - Email: `test@example.com`
   - Password: `Test@1234`
   - Name: `Test User`
   - Phone: `+91-1234567890`
   - City: `Mumbai`
   - Ward: `A Ward`
4. Click "Create Account"

**Check it worked**:
- Go to Supabase **Authentication** → Users
- You should see your new user
- Go to SQL Editor, run: `SELECT * FROM users;`
- You should see your user record

### Test 2: Report Issue
1. Log in with the account you created
2. Go to `/report` page
3. Fill in:
   - Category: Pick any option
   - Photos: Upload an image (or skip)
   - Location: Click "Use current location" or enter address
   - Title: "Test Issue"
   - Description: "This is a test issue for verification"
   - Severity: "High"
   - Check confirmation box
4. Click "Submit Report"

**Check it worked**:
- You should see a success message
- Go to Supabase **SQL Editor**
- Run: `SELECT id, title, description, status, created_at FROM issues ORDER BY created_at DESC LIMIT 5;`
- Your issue should appear!

### Test 3: Add Comment
1. Go to the issue you just created (click on it from dashboard)
2. Scroll to comments section
3. Type a comment
4. Click "Add Comment"

**Check it worked**:
- Go to SQL Editor
- Run: `SELECT * FROM issue_comments ORDER BY created_at DESC LIMIT 5;`
- Your comment should appear

### Test 4: Vote on Issue
1. On issue detail page
2. Click the upvote button
3. Count should increase

**Check it worked**:
- Run: `SELECT * FROM issue_votes ORDER BY created_at DESC LIMIT 5;`
- Your vote should appear

---

## Troubleshooting

### Issue: "Not authenticated" error
**Solution**: 
- Make sure you're logged in
- Clear browser cookies
- Try signing up again

### Issue: "Failed to create user profile"
**Solution**:
- Check environment variables are correct
- Verify database schema was created successfully
- Run: `SELECT table_name FROM information_schema.tables WHERE table_schema='public';`
- Should see: users, issues, issue_comments, etc.

### Issue: "File upload failed"
**Solution**:
- Check storage buckets exist in Supabase
- Verify bucket policies allow authenticated users
- File must be < 10MB

### Issue: Files don't appear in database
**Solution**:
- Check browser console for errors (F12)
- Check Supabase logs: **Logs** → **API** tab
- Ensure .env.local has correct credentials
- Restart dev server: `npm run dev`

### Issue: Database tables don't exist
**Solution**:
- Go to Supabase **SQL Editor**
- Run: `SELECT * FROM users;`
- If error: "does not exist", re-run `complete-schema.sql`
- Make sure script completed without errors

---

## Database Tables Explained

### `users`
Stores user profiles created on signup
```sql
SELECT * FROM users;
```
Columns: id, email, name, phone, user_type, municipality, city, ward_number, location, is_verified, created_at

### `issues`
Stores civic issues reported by users
```sql
SELECT id, title, category, status, upvotes FROM issues;
```
Columns: id, title, description, category, priority, status, user_id, location, address, created_at

### `issue_comments`
Stores comments/discussions on issues
```sql
SELECT * FROM issue_comments WHERE issue_id = 'issue-uuid';
```

### `issue_votes`
Stores upvotes/downvotes
```sql
SELECT * FROM issue_votes;
```

### `notifications`
Stores user notifications
```sql
SELECT * FROM notifications WHERE user_id = 'user-uuid' AND is_read = false;
```

### `analytics`
Stores all user actions for analytics
```sql
SELECT COUNT(*), event_type FROM analytics GROUP BY event_type;
```

---

## Common Queries

### View all issues
```sql
SELECT id, title, category, status, upvotes, created_at 
FROM issues 
ORDER BY created_at DESC;
```

### View my issues
```sql
SELECT * FROM issues 
WHERE user_id = 'YOUR_USER_ID' 
ORDER BY created_at DESC;
```

### View unread notifications
```sql
SELECT * FROM notifications 
WHERE user_id = 'YOUR_USER_ID' 
AND is_read = false 
ORDER BY created_at DESC;
```

### View comments on an issue
```sql
SELECT ic.*, u.name 
FROM issue_comments ic 
JOIN users u ON ic.user_id = u.id 
WHERE ic.issue_id = 'ISSUE_UUID' 
ORDER BY ic.created_at DESC;
```

### Count issues by status
```sql
SELECT status, COUNT(*) as count 
FROM issues 
GROUP BY status;
```

### View analytics
```sql
SELECT event_type, COUNT(*) as count 
FROM analytics 
GROUP BY event_type 
ORDER BY count DESC;
```

---

## Frontend Code Integration

### Making API Calls in Frontend

The API client library (`src/lib/api-client.ts`) handles all the backend communication:

```typescript
import {
  createIssue,
  getIssues,
  addComment,
  voteOnIssue
} from '@/lib/api-client'

// Create an issue
const { success, data } = await createIssue({
  title: 'Pothole',
  description: 'Large pothole...',
  category: 'Road & Infrastructure',
  priority: 'high',
  location: { latitude: 19.0760, longitude: 72.8777 },
  address: 'Main Street, Mumbai'
})

if (success) {
  console.log('Issue created!', data)
} else {
  console.error('Error:', data?.error)
}
```

---

## Monitoring Data

### Real-time View
Use Supabase **Realtime** to see database changes live:
1. Go to **SQL Editor**
2. Run: `SELECT * FROM issues;`
3. Add a new issue in the app
4. Results update automatically

### Logs
View API activity:
1. Go to **Logs** → **API** tab
2. Scroll through recent requests
3. Check for errors (HTTP 400, 500, etc.)

---

## Summary Checklist

- [ ] Created Supabase project
- [ ] Copied environment credentials
- [ ] Created `.env.local` file with credentials
- [ ] Ran `complete-schema.sql` to create database
- [ ] (Optional) Ran `sample-data.sql` to add test data
- [ ] Created storage buckets (issue-attachments, avatars, etc.)
- [ ] Installed npm dependencies
- [ ] Started dev server: `npm run dev`
- [ ] Tested signup - verified user appears in database
- [ ] Tested issue creation - verified issue appears in database
- [ ] Tested comments - verified comment appears in database
- [ ] Tested voting - verified vote appears in database

✅ **Everything working!**

---

## Next Steps

1. **Explore the App**
   - Create several test issues
   - Add comments and votes
   - Check the dashboard

2. **Review Data in Supabase**
   - Go to SQL Editor
   - Write queries to explore your data
   - See how tables connect to each other

3. **Customize**
   - Modify issue categories
   - Add more user types
   - Customize notifications

4. **Deploy**
   - When ready for production
   - Deploy to Vercel
   - Update environment variables

---

**Questions?** Check the `API_IMPLEMENTATION_GUIDE.md` for detailed API documentation.


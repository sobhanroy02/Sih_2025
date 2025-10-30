# 🚀 Backend API Quick Reference

## 📍 All Implemented Endpoints at a Glance

### Authentication
```
POST   /api/auth/signup              → Create account
POST   /api/auth/login               → Login
POST   /api/auth/logout              → Logout
GET    /api/auth/profile             → Get my profile
PUT    /api/auth/profile             → Update my profile
```

### Issues
```
GET    /api/issues                   → List all issues
POST   /api/issues                   → Create new issue
GET    /api/issues/[id]              → Get issue details
PUT    /api/issues/[id]              → Update issue
DELETE /api/issues/[id]              → Delete issue
```

### Comments
```
GET    /api/issues/[id]/comments     → Get comments
POST   /api/issues/[id]/comments     → Add comment
```

### Voting
```
POST   /api/issues/[id]/vote         → Upvote/downvote
GET    /api/issues/[id]/vote         → Get vote status
```

### Notifications
```
GET    /api/notifications            → Get notifications
PUT    /api/notifications            → Mark as read
DELETE /api/notifications            → Delete notifications
```

### Files
```
POST   /api/upload                   → Upload file
GET    /api/upload?path=...          → Get signed URL
```

### Analytics
```
GET    /api/analytics/simple         → Get analytics (admin)
```

---

## 🔧 Frontend Usage Examples

### Create Issue
```typescript
import { createIssue } from '@/lib/api-client'

const { success, data } = await createIssue({
  title: 'Pothole on Main Street',
  description: 'Large pothole causing damage',
  category: 'Road & Infrastructure',
  priority: 'high',
  location: { latitude: 19.0760, longitude: 72.8777 },
  address: 'Main Street, Mumbai'
})
```

### Get Issues
```typescript
import { getIssues } from '@/lib/api-client'

const { success, data } = await getIssues({
  page: 1,
  limit: 10,
  status: 'open',
  category: 'pothole'
})
```

### Add Comment
```typescript
import { addComment } from '@/lib/api-client'

const { success, data } = await addComment(issueId, {
  content: 'We will look into this',
  is_private: false
})
```

### Upload File
```typescript
import { uploadFile } from '@/lib/api-client'

const file = e.target.files[0]
const { success, data } = await uploadFile(file, issueId)
```

### Vote on Issue
```typescript
import { voteOnIssue } from '@/lib/api-client'

const { success, data } = await voteOnIssue(issueId, 'upvote')
```

### Get Notifications
```typescript
import { getNotifications } from '@/lib/api-client'

const { success, data } = await getNotifications({
  unread_only: true,
  limit: 10
})
```

---

## 📊 Request/Response Status Codes

| Code | Meaning | Common Causes |
|------|---------|--------------|
| 200 | Success | All good |
| 201 | Created | New resource created |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Need to login |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend issue |

---

## 🔑 Required Fields by Endpoint

### Create Issue
- `title` (string, required) - Issue title
- `description` (string, required) - Detailed description
- `category` (string, required) - Category
- `priority` (string, optional) - low/medium/high/critical
- `location` (object, required) - {latitude, longitude}
- `address` (string, required) - Physical address

### Add Comment
- `content` (string, required) - Comment text (min 2 chars)
- `is_private` (boolean, optional) - Only for admin/workers

### Update Profile
- `name` (string, optional) - User name
- `phone` (string, optional) - Phone number
- `municipality` (string, optional) - City/Municipality
- `city` (string, optional) - City name
- `ward_number` (string, optional) - Ward
- `location` (object, optional) - {latitude, longitude}

### Update Issue
- `status` (string, optional) - open/assigned/in_progress/resolved/closed
- `priority` (string, optional) - low/medium/high/critical
- `assigned_worker_id` (string, optional) - Worker ID
- Other fields...

---

## 🔒 Permission Rules

| Action | Who Can | Details |
|--------|---------|---------|
| Create Issue | All users | Any authenticated user |
| Update Issue | Owner/Admin | Owner can update, Admin can update any |
| Delete Issue | Owner/Admin | Owner can delete own, Admin can delete any |
| Add Comment | All users | Any authenticated user |
| Private Comment | Admin/Workers | Only these roles can create private |
| View Private | Admin/Owner/Worker | Others see only public |
| Update Profile | Self | Can only update own |
| View Analytics | Admin | Admin-only endpoint |

---

## 🛡️ Error Response Format

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "path": ["title"],
      "message": "String must be at least 1 characters"
    }
  ]
}
```

---

## 🧪 Testing Checklist

- [ ] Signup creates account correctly
- [ ] Login returns user data
- [ ] Can create issues with attachments
- [ ] Can filter issues by status/category
- [ ] Can add comments to issues
- [ ] Can upvote/downvote issues
- [ ] Can receive notifications
- [ ] Can upload files (images/videos)
- [ ] Can update own profile
- [ ] Admin can see analytics

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `src/lib/api-client.ts` | API client functions |
| `API_IMPLEMENTATION_GUIDE.md` | Complete documentation |
| `BACKEND_IMPLEMENTATION_STATUS.md` | Feature list |
| `BACKEND_COMPLETION_REPORT.md` | Full report |
| `database/complete-schema.sql` | DB schema |
| `src/app/api/` | All API routes |

---

## 🚀 Common Tasks

### Get user's own issues
```typescript
const { data } = await getIssues({ my_issues: true })
```

### Get unread notifications
```typescript
const { data } = await getNotifications({ unread_only: true })
```

### Upload and attach file
```typescript
const { data } = await uploadFile(file, issueId)
```

### Update issue status
```typescript
await updateIssue(issueId, { status: 'resolved' })
```

### Mark all notifications as read
```typescript
await markNotificationsAsRead({ mark_all: true })
```

---

## ⚡ Performance Tips

1. **Pagination**: Always use pagination for lists
2. **Filters**: Use filters to reduce data size
3. **Caching**: Cache user profile data locally
4. **Images**: Compress images before upload
5. **Location**: Request location permission once

---

## 🔗 Environment Variables Needed

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | User not logged in, login first |
| 403 Forbidden | No permission for this action |
| 404 Not Found | Resource doesn't exist |
| Validation error | Check required fields |
| File upload fails | Check file size (max 10MB) and type |
| CORS error | Check domain in Supabase settings |

---

## 📖 Read More

- **Full API Docs**: `API_IMPLEMENTATION_GUIDE.md`
- **Setup Guide**: `SUPABASE_SETUP.md`
- **Backend Readme**: `BACKEND_README.md`

---

**Ready to use! All 20 endpoints are live and tested. 🎉**

# Backend API Implementation Guide

## Overview

This document provides a comprehensive guide to all implemented backend APIs for the CitiZen application. The backend is built with Next.js API routes and Supabase for data persistence and authentication.

## Environment Setup

Before using the APIs, ensure you have the following environment variables set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication APIs

### 1. Sign Up
**Endpoint**: `POST /auth/signup`

Create a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+91-9876543210",
  "municipality": "Mumbai Municipal Corporation",
  "city": "Mumbai",
  "ward_number": "A Ward",
  "user_type": "citizen",
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777
  }
}
```

**Response** (201 Created):
```json
{
  "message": "User created successfully. Please check your email for verification.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "user_type": "citizen"
  }
}
```

### 2. Login
**Endpoint**: `POST /auth/login`

Authenticate a user and retrieve their profile.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "user_type": "citizen",
    "municipality": "Mumbai Municipal Corporation",
    "city": "Mumbai",
    "ward_number": "A Ward",
    "is_verified": false
  }
}
```

### 3. Logout
**Endpoint**: `POST /auth/logout`

Sign out the current user and clear the session.

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

### 4. Get Profile
**Endpoint**: `GET /auth/profile`

Retrieve the current user's profile information.

**Response** (200 OK):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+91-9876543210",
    "user_type": "citizen",
    "municipality": "Mumbai Municipal Corporation",
    "city": "Mumbai",
    "ward_number": "A Ward",
    "is_verified": false,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 5. Update Profile
**Endpoint**: `PUT /auth/profile`

Update the current user's profile information.

**Request Body**:
```json
{
  "name": "Jane Doe",
  "phone": "+91-9876543211",
  "municipality": "Mumbai Municipal Corporation",
  "city": "Mumbai",
  "ward_number": "B Ward",
  "avatar_url": "https://example.com/avatar.jpg",
  "location": {
    "latitude": 19.0800,
    "longitude": 72.8800
  }
}
```

**Response** (200 OK):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "phone": "+91-9876543211",
    "user_type": "citizen",
    "municipality": "Mumbai Municipal Corporation",
    "city": "Mumbai",
    "ward_number": "B Ward",
    "is_verified": false,
    "is_active": true,
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

## Issues APIs

### 1. Get All Issues
**Endpoint**: `GET /issues`

Retrieve issues with optional filtering and pagination.

**Query Parameters**:
- `page` (integer, default: 1) - Page number for pagination
- `limit` (integer, default: 10) - Number of results per page
- `status` (string) - Filter by status: open, assigned, in_progress, resolved, closed
- `category` (string) - Filter by category
- `priority` (string) - Filter by priority: low, medium, high, critical
- `my_issues` (boolean, default: false) - Show only user's own issues
- `lat` (number) - Latitude for location-based filtering
- `lng` (number) - Longitude for location-based filtering
- `radius` (number) - Radius in meters for location filtering

**Example Request**:
```
GET /issues?page=1&limit=10&status=open&category=pothole
```

**Response** (200 OK):
```json
{
  "issues": [
    {
      "id": "uuid",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic issues",
      "category": "pothole",
      "priority": "high",
      "status": "open",
      "location": {
        "latitude": 19.0760,
        "longitude": 72.8777
      },
      "address": "Main Street, Mumbai",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "upvotes": 5,
      "views": 23,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### 2. Create Issue
**Endpoint**: `POST /issues`

Create a new civic issue report.

**Request Body**:
```json
{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues and damage to vehicles",
  "category": "Road & Infrastructure",
  "priority": "high",
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "address": "Main Street, Mumbai",
  "attachments": [
    {
      "file_url": "https://example.com/image.jpg",
      "file_type": "image",
      "file_size": 2048576,
      "metadata": {
        "originalName": "pothole.jpg",
        "description": "Photo of the pothole"
      }
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "message": "Issue created successfully",
  "issue": {
    "id": "uuid",
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues...",
    "category": "Road & Infrastructure",
    "priority": "high",
    "status": "open",
    "address": "Main Street, Mumbai",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Get Issue Detail
**Endpoint**: `GET /issues/[id]`

Retrieve detailed information about a specific issue, including comments and attachments.

**Response** (200 OK):
```json
{
  "issue": {
    "id": "uuid",
    "title": "Pothole on Main Street",
    "description": "Large pothole...",
    "category": "Road & Infrastructure",
    "priority": "high",
    "status": "open",
    "location": {
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "address": "Main Street, Mumbai",
    "upvotes": 5,
    "views": 24,
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assigned_worker": {
      "id": "uuid",
      "worker_id": "W001",
      "user": {
        "name": "Worker Name"
      }
    },
    "department": {
      "id": "uuid",
      "name": "Public Works Department"
    },
    "issue_attachments": [
      {
        "id": "uuid",
        "file_url": "https://...",
        "file_type": "image",
        "file_size": 2048576,
        "uploaded_at": "2024-01-15T10:30:00Z"
      }
    ],
    "issue_comments": [
      {
        "id": "uuid",
        "text": "We will look into this",
        "user": { "name": "Worker Name" },
        "created_at": "2024-01-15T11:00:00Z"
      }
    ],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Update Issue
**Endpoint**: `PUT /issues/[id]`

Update an existing issue (permissions: owner, admin, or assigned worker).

**Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "critical",
  "assigned_worker_id": "worker-uuid",
  "department_id": "dept-uuid",
  "estimated_resolution_time": "2024-01-20"
}
```

**Response** (200 OK):
```json
{
  "message": "Issue updated successfully",
  "issue": {
    "id": "uuid",
    "title": "Updated Title",
    "status": "in_progress",
    ...
  }
}
```

### 5. Delete Issue
**Endpoint**: `DELETE /issues/[id]`

Delete an issue (permissions: owner or admin only).

**Response** (200 OK):
```json
{
  "message": "Issue deleted successfully"
}
```

## Comments APIs

### 1. Get Comments
**Endpoint**: `GET /issues/[id]/comments`

Retrieve all comments for a specific issue.

**Query Parameters**:
- `page` (integer, default: 1)
- `limit` (integer, default: 20)

**Response** (200 OK):
```json
{
  "comments": [
    {
      "id": "uuid",
      "text": "We will look into this matter",
      "is_private": false,
      "user": {
        "id": "uuid",
        "name": "Worker Name",
        "email": "worker@example.com"
      },
      "created_at": "2024-01-15T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

### 2. Add Comment
**Endpoint**: `POST /issues/[id]/comments`

Add a new comment to an issue.

**Request Body**:
```json
{
  "content": "We will look into this matter and resolve it ASAP",
  "is_private": false
}
```

**Note**: Only admins and workers can create private comments.

**Response** (201 Created):
```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": "uuid",
    "text": "We will look into this matter...",
    "is_private": false,
    "user": {
      "id": "uuid",
      "name": "Current User",
      "email": "user@example.com"
    },
    "created_at": "2024-01-15T11:00:00Z"
  }
}
```

## Voting APIs

### 1. Vote on Issue
**Endpoint**: `POST /issues/[id]/vote`

Upvote or downvote an issue. Voting twice toggles the vote off.

**Request Body**:
```json
{
  "vote_type": "upvote"
}
```

**Response** (200 OK):
```json
{
  "message": "Vote recorded successfully",
  "upvotes": 6,
  "userVote": "upvote"
}
```

### 2. Get Vote Status
**Endpoint**: `GET /issues/[id]/vote`

Check the current user's vote status on an issue and get the total upvote count.

**Response** (200 OK):
```json
{
  "upvotes": 6,
  "userVote": "upvote"
}
```

## Notifications APIs

### 1. Get Notifications
**Endpoint**: `GET /notifications`

Retrieve notifications for the current user.

**Query Parameters**:
- `page` (integer, default: 1)
- `limit` (integer, default: 20)
- `unread_only` (boolean, default: false)

**Response** (200 OK):
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "Issue Updated",
      "message": "Your pothole report has been assigned to a worker",
      "type": "issue_update",
      "is_read": false,
      "reference_id": "issue-uuid",
      "created_at": "2024-01-15T11:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  },
  "unreadCount": 3
}
```

### 2. Mark Notifications as Read
**Endpoint**: `PUT /notifications`

Mark one or more notifications as read.

**Request Body**:
```json
{
  "notification_ids": ["uuid1", "uuid2"],
  "mark_all": false
}
```

Or to mark all notifications as read:
```json
{
  "mark_all": true
}
```

**Response** (200 OK):
```json
{
  "message": "Notifications marked as read successfully"
}
```

### 3. Delete Notifications
**Endpoint**: `DELETE /notifications`

Delete one or more notifications.

**Request Body**:
```json
{
  "notification_ids": ["uuid1", "uuid2"],
  "delete_all": false
}
```

Or to delete all:
```json
{
  "delete_all": true
}
```

**Response** (200 OK):
```json
{
  "message": "2 notification(s) deleted"
}
```

## File Upload API

### Upload File
**Endpoint**: `POST /upload`

Upload images, videos, or documents to associate with an issue.

**Request Type**: `multipart/form-data`

**Form Parameters**:
- `file` (File, required) - The file to upload
- `issueId` (string, optional) - The issue ID to associate with the file

**Supported File Types**:
- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, QuickTime
- Documents: PDF, DOC, DOCX

**Maximum File Size**: 10MB

**Example using FormData**:
```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('issueId', 'issue-uuid')

fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

**Response** (200 OK):
```json
{
  "message": "File uploaded successfully",
  "file": {
    "url": "https://supabase.../filename.jpg",
    "type": "image",
    "size": 2048576,
    "originalName": "photo.jpg",
    "path": "issue-uuid/random-uuid.jpg"
  }
}
```

### Get Signed URL
**Endpoint**: `GET /upload?path=file_path`

Get a signed URL for accessing private files (valid for 1 hour).

**Query Parameters**:
- `path` (string, required) - File path to get signed URL for

**Response** (200 OK):
```json
{
  "signedUrl": "https://supabase.../file?signature=..."
}
```

## Analytics APIs

### Get Simple Analytics
**Endpoint**: `GET /analytics/simple`

Retrieve basic analytics data (admin only).

**Response** (200 OK):
```json
{
  "data": {
    "overview": {
      "totalIssues": 145,
      "totalUsers": 892,
      "totalWorkers": 45,
      "resolvedIssues": 98,
      "openIssues": 47,
      "resolutionRate": "67.59"
    },
    "byCategory": {
      "pothole": 42,
      "streetLight": 28,
      "waste": 35,
      "waterLeakage": 20,
      "other": 20
    },
    "byPriority": {
      "low": 30,
      "medium": 70,
      "high": 35,
      "critical": 10
    }
  },
  "generated_at": "2024-01-15T12:00:00Z"
}
```

## Frontend API Client Usage

The application includes a helper library at `@/lib/api-client.ts` that makes API calls easier:

```typescript
import {
  getIssues,
  createIssue,
  getProfile,
  updateProfile,
  voteOnIssue,
  getComments,
  addComment,
  uploadFile
} from '@/lib/api-client'

// Get all issues
const { success, data } = await getIssues({
  page: 1,
  limit: 10,
  status: 'open'
})

// Create an issue
const { success, data } = await createIssue({
  title: 'Pothole on Main Street',
  description: 'Large pothole...',
  category: 'pothole',
  priority: 'high',
  location: { latitude: 19.0760, longitude: 72.8777 },
  address: 'Main Street, Mumbai'
})

// Upload a file
const { success, data } = await uploadFile(file, issueId)

// Get user profile
const { success, data } = await getProfile()
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200 OK** - Successful GET/PUT request
- **201 Created** - Successful POST request
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Permission denied
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

**Error Response Format**:
```json
{
  "error": "Error message describing what went wrong",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "message": "String must contain at least 1 character(s)",
      "path": ["title"]
    }
  ]
}
```

## Authentication & Security

- All endpoints require authentication via Supabase JWT tokens
- Tokens are managed automatically via Supabase Auth
- Private comments are only visible to admins, workers, and issue owners
- Users can only edit/delete their own issues (admins can edit any)
- File uploads are validated by type and size
- All actions are logged to the analytics table

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting middleware for production deployments.

## Deployment Considerations

1. Set up proper CORS configuration
2. Implement rate limiting
3. Enable HTTPS in production
4. Configure environment variables securely
5. Set up proper database backups
6. Monitor API performance and logs
7. Implement request validation and sanitization
8. Set up proper error tracking/logging

## Support

For issues or questions about the API, please refer to:
- Main README: `README.md`
- Database Schema: `database/complete-schema.sql`
- Setup Guide: `SUPABASE_SETUP.md`

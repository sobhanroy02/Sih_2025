# CitiZen Backend API Documentation

This is the backend API for the CitiZen application built with Next.js and Supabase.

## Overview

The CitiZen backend provides a comprehensive API for civic issue management with the following features:

- **Authentication**: User registration, login, logout, and profile management
- **Issue Management**: CRUD operations for civic issues with geospatial support
- **File Upload**: Image, video, and document upload for issue attachments
- **Voting System**: Upvote/downvote functionality for issues
- **Comments**: Comment system for issues with private comments for workers
- **Notifications**: Real-time notifications for users
- **Analytics**: Dashboard analytics for administrators
- **Geospatial Operations**: Location-based queries and mapping

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL with PostGIS)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Validation**: Zod
- **TypeScript**: Full type safety

## Database Schema

The database includes the following main tables:

- `users` - User profiles and authentication data
- `issues` - Civic issues with geospatial data
- `departments` - Municipal departments
- `workers` - Worker profiles and availability
- `issue_attachments` - File attachments for issues
- `issue_comments` - Comments on issues
- `issue_votes` - Voting data for issues
- `notifications` - User notifications
- `analytics` - Event tracking and analytics

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Issues

- `GET /api/issues` - Get all issues (with filters)
- `POST /api/issues` - Create new issue
- `GET /api/issues/[id]` - Get specific issue
- `PUT /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue
- `POST /api/issues/[id]/vote` - Vote on issue
- `GET /api/issues/[id]/vote` - Get vote status
- `GET /api/issues/[id]/comments` - Get issue comments
- `POST /api/issues/[id]/comments` - Add comment to issue

### File Upload

- `POST /api/upload` - Upload files (images, videos, documents)
- `GET /api/upload` - Get signed URL for file access

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications` - Mark notifications as read

### Analytics

- `GET /api/analytics/simple` - Get basic analytics data

## Environment Variables

Create `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# External Services (Optional)
GOOGLE_MAPS_API_KEY=your_google_maps_key
OPENAI_API_KEY=your_openai_key
```

## Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Optionally, insert sample data from `database/sample-data.sql`
4. Configure Row Level Security (RLS) policies
5. Set up storage buckets for file uploads

## Installation and Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. Run the development server:
```bash
npm run dev
```

## API Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "user_type": "citizen",
    "municipality": "Mumbai Municipal Corporation"
  }'
```

### Create a new issue

```bash
curl -X POST http://localhost:3000/api/issues \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "title": "Pothole on Main Street",
    "description": "Large pothole causing traffic issues",
    "category": "Road & Infrastructure",
    "priority": "high",
    "location": {
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "address": "Main Street, Mumbai"
  }'
```

### Upload an attachment

```bash
curl -X POST http://localhost:3000/api/upload \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -F "file=@image.jpg" \\
  -F "issueId=ISSUE_UUID"
```

## Security Features

- Row Level Security (RLS) policies
- JWT-based authentication
- File type and size validation
- Rate limiting (recommended to implement)
- CORS configuration
- Input validation with Zod schemas

## Geospatial Features

- PostGIS extension for geospatial queries
- Point-in-polygon operations for ward detection
- Distance calculations for worker assignment
- Spatial indexing for performance

## Real-time Features

The API supports real-time features through:
- Supabase Realtime subscriptions
- Notification system
- Live updates for issue status changes

## Deployment

The API can be deployed on:
- Vercel (recommended for Next.js)
- Railway
- AWS/GCP/Azure
- Any Node.js hosting platform

Make sure to:
1. Set up environment variables in production
2. Configure database connection pooling
3. Set up proper monitoring and logging
4. Implement rate limiting and security headers

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Write comprehensive tests
4. Document API changes
5. Follow RESTful conventions

## License

This project is licensed under the MIT License.
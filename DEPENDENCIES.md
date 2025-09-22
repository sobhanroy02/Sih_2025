# CitiZen Backend Dependencies

## Node.js Dependencies (package.json)

### Core Framework
- **next@15.5.3** - React framework for production
- **react@19.1.0** - React library
- **react-dom@19.1.0** - React DOM bindings
- **typescript@5** - TypeScript language support

### Authentication & Database
- **@supabase/supabase-js@2.57.4** - Supabase client library
- **@supabase/ssr@0.7.0** - Server-side rendering support
- **@supabase/auth-helpers-nextjs@0.10.0** - Next.js auth helpers
- **bcryptjs@3.0.2** - Password hashing
- **uuid@13.0.0** - UUID generation

### Validation & Forms
- **zod@4.1.9** - Schema validation
- **react-hook-form@7.62.0** - Form handling
- **@hookform/resolvers@5.2.2** - Form validation resolvers

### UI Components
- **@headlessui/react@2.2.8** - Unstyled UI components
- **@heroicons/react@2.2.0** - Icon library
- **@radix-ui/react-*** - Primitive UI components
  - checkbox@1.3.3
  - dialog@1.1.15
  - dropdown-menu@2.1.16
  - select@2.2.6
  - tabs@1.1.13
- **lucide-react@0.544.0** - Icon library
- **framer-motion@12.23.16** - Animation library

### Styling
- **tailwindcss@4** - Utility-first CSS framework
- **@tailwindcss/forms@0.5.10** - Form styling
- **@tailwindcss/typography@0.5.18** - Typography plugin
- **@tailwindcss/aspect-ratio@0.4.2** - Aspect ratio utilities
- **class-variance-authority@0.7.1** - Component variants
- **clsx@2.1.1** - Conditional classes
- **tailwind-merge@3.3.1** - Tailwind class merging

### File Handling & Communication
- **sharp@0.34.4** - Image processing
- **nodemailer@7.0.6** - Email sending
- **socket.io@4.8.1** - Real-time communication

### State Management
- **zustand@5.0.8** - State management library

### PWA Support
- **next-pwa@5.6.0** - Progressive Web App support
- **workbox-webpack-plugin@7.3.0** - Workbox integration

### Development Dependencies
- **eslint@9** - Code linting
- **eslint-config-next@15.5.3** - Next.js ESLint config
- **@types/*** - TypeScript type definitions

## System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **PostgreSQL**: 13.0 or higher (via Supabase)
- **PostGIS**: 3.0 or higher (for geospatial features)

## Installation Commands

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (optional)
pip install -r requirements.txt

# Development server
npm run dev

# Production build
npm run build
npm start
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
UPLOAD_MAX_SIZE=10485760
CLASSIFICATION_API_KEY=your_ai_api_key
```

## API Endpoints Available

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Issues Management
- `GET /api/issues` - List issues with filtering
- `POST /api/issues` - Create new issue
- `GET /api/issues/[id]` - Get specific issue
- `PUT /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

### Issue Interactions
- `GET /api/issues/[id]/comments` - Get issue comments
- `POST /api/issues/[id]/comments` - Add comment
- `GET /api/issues/[id]/vote` - Get vote status
- `POST /api/issues/[id]/vote` - Vote on issue

### File Management
- `POST /api/upload` - Upload files/images

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Send notification

### Analytics
- `GET /api/analytics/simple` - Get analytics data
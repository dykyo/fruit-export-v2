# Fruit Export Management System

A comprehensive web application for managing fruit export operations, built with Next.js 15 and Supabase.

## Features

- **Authentication**: Secure login with Supabase Auth
- **User Management**: Role-based access control (Admin/User)
- **Data Management**: CRUD operations for:
  - Shippers
  - Consignees
  - Notify Parties
  - Containers
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dashboard**: Key metrics and summary information

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Real-time)
- **UI Components**: Custom components with Lucide React icons
- **Forms**: React Hook Form with Zod validation

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd fruit-export-v2
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase/schema.sql`
3. Run the SQL to create all tables, policies, and sample data

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── lib/                   # Utility functions and configurations
│   ├── supabase/          # Supabase client configurations
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
```

## Authentication

The application uses Supabase Auth with the following features:
- Email/password authentication
- Automatic user profile creation
- Role-based access control
- Protected routes with middleware

## Database Schema

The application includes the following main entities:
- **Users**: User profiles with role-based permissions
- **Shippers**: Export company information
- **Consignees**: Import company information
- **Notify Parties**: Notification contact information
- **Containers**: Container tracking and management

## Development

### Adding New Features

1. Create database tables in `supabase/schema.sql`
2. Update TypeScript types in `src/types/database.ts`
3. Create UI components in `src/components/`
4. Add pages in `src/app/`

### Testing

```bash
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
```

## Deployment

The application can be deployed to Vercel, Netlify, or any platform that supports Next.js.

1. Connect your repository to your deployment platform
2. Set environment variables in your deployment platform
3. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

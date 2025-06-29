# Fruit Export Management System - Setup Guide

This guide will help you set up the Fruit Export Management System on your local machine and deploy it to production.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- Git (for version control)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repository-url>
cd fruit-export-v2
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details:
   - **Name**: Fruit Export Management
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
4. Wait for the project to be created (usually takes 2-3 minutes)

#### Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon public key** (under "Project API keys")
   - **Service role key** (under "Project API keys") - Keep this secret!

#### Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-here
   ```

#### Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` and paste it into the editor
4. Click "Run" to execute the SQL
5. Verify that the tables were created by going to **Table Editor**

### 3. Run the Application

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 4. Create Your First Admin User

Since the application requires authentication, you'll need to create your first user:

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter an email and password
4. After creating the user, go to **Table Editor** → **users**
5. Find your user record and change the `role` from `user` to `admin`
6. Now you can log in with admin privileges

## Application Features

### User Roles

- **Admin**: Can manage users and all data
- **User**: Can manage data but not users

### Main Features

1. **Dashboard**: Overview of all data with key metrics
2. **User Management** (Admin only): Create, edit, and manage user accounts
3. **Shipper Management**: Manage export companies
4. **Consignee Management**: Manage import companies
5. **Notify Party Management**: Manage notification contacts
6. **Container Management**: Track shipping containers

### Navigation

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Collapsible Sidebar**: Space-efficient navigation
- **Role-based Menu**: Different options based on user role

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set the environment variables in Vercel:
   - Go to your project settings
   - Add all the environment variables from your `.env.local`
   - Update `NEXTAUTH_URL` to your production domain
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Troubleshooting

### Common Issues

1. **"Supabase is not configured" error**
   - Check that your environment variables are set correctly
   - Ensure the Supabase URL doesn't end with a trailing slash
   - Verify the keys are copied correctly from Supabase dashboard

2. **Database connection errors**
   - Verify your Supabase project is active
   - Check that the SQL schema was executed successfully
   - Ensure RLS policies are enabled

3. **Authentication issues**
   - Make sure you have at least one user in the database
   - Check that the user's role is set correctly
   - Verify email confirmation settings in Supabase Auth

### Getting Help

1. Check the browser console for error messages
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Ensure the database schema is properly set up

## Development Tips

### Adding New Features

1. **Database Changes**: Update `supabase/schema.sql` and `src/types/database.ts`
2. **New Pages**: Add to `src/app/dashboard/` following the existing pattern
3. **Forms**: Create in `src/components/forms/` using the existing form components
4. **Navigation**: Update `src/components/layout/sidebar.tsx`

### Code Structure

- `src/app/`: Next.js App Router pages
- `src/components/`: Reusable UI components
- `src/lib/`: Utility functions and configurations
- `src/types/`: TypeScript type definitions
- `supabase/`: Database schema and migrations

## Security Notes

- Never commit your `.env.local` file
- Keep your service role key secret
- Use Row Level Security (RLS) for all database operations
- Regularly update dependencies for security patches

## Support

For issues and questions:
1. Check this setup guide
2. Review the application logs
3. Check Supabase documentation
4. Contact your development team

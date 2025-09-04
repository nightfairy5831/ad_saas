# Ad SaaS Platform

A modern advertising management platform built with Next.js, Supabase, and Prisma.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (Auth, Database, Storage)
- **ORM**: Prisma
- **State Management**: Zustand
- **Validation**: Zod

## Project Structure

```
ad_SasS/
├── src/                    # Source code directory
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Authentication routes
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/   # Protected dashboard routes
│   │   │   └── dashboard/
│   │   ├── (marketing)/   # Public marketing pages
│   │   ├── api/           # API routes
│   │   │   ├── auth/
│   │   │   └── webhooks/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/        # React components
│   │   ├── ui/           # UI components
│   │   ├── forms/        # Form components
│   │   └── layout/       # Layout components
│   ├── lib/              # Utility libraries
│   │   ├── supabase/     # Supabase client setup
│   │   ├── prisma/       # Prisma client
│   │   └── utils/        # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── services/         # Business logic and API services
│   └── styles/           # Global styles
├── public/                # Static files
│   └── images/           # Image assets
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma
└── middleware.ts         # Next.js middleware (root level)
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- PostgreSQL database (provided by Supabase)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ad_SasS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase project credentials
   ```bash
   cp .env.local.example .env.local
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database

## Database Schema

The application uses the following main entities:

- **User** - Application users
- **Organization** - Companies/teams
- **OrganizationMember** - User-organization relationships
- **Project** - Ad campaigns and projects

## Features

- User authentication with Supabase Auth
- Multi-organization support
- Role-based access control (Owner, Admin, Member, Viewer)
- Project management
- Dashboard with analytics
- Responsive design

## Deployment

The application can be deployed to:

- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

Make sure to set all environment variables in your deployment platform.

## License

MIT
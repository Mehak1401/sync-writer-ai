# ScholarSync AI

An AI-powered academic paper writing and collaboration platform.

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Getting Started

### Prerequisites

- Node.js & npm (or Bun)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd scholarsync-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

The development server will start on port 8080.

## Available Scripts

```sh
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
```

## Project Structure

- `src/pages/` - Route-level components
- `src/components/` - React components
- `src/hooks/` - Custom React hooks
- `src/integrations/supabase/` - Supabase client and types
- `supabase/migrations/` - Database migrations

## Database

This project uses Supabase for authentication and database. The schema includes:

- `profiles` - User profiles
- `user_roles` - Role assignments (student/advisor/director)
- `papers` - Academic papers
- `paper_versions` - Version history
- `student_advisor` - Student-advisor relationships

All tables have Row Level Security (RLS) enabled.

## Features

- Role-based access control (students, advisors, directors)
- Paper management with versioning
- AI-powered writing assistance
- Real-time collaboration

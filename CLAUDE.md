# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an academic paper writing application built with React, TypeScript, Vite, and Supabase. It features a role-based access system (students, advisors, directors), paper versioning, and an AI copilot sidebar.

## Development Commands

```bash
# Install dependencies (uses Bun primarily, npm also works)
bun install

# Start development server (runs on port 8080)
bun run dev

# Build for production
bun run build

# Run linting
bun run lint

# Run tests once
bun run test

# Run tests in watch mode
bun run test:watch
```

## Architecture

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 with SWC plugin
- **UI Library**: shadcn/ui with Radix UI primitives and Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack React Query
- **Testing**: Vitest with React Testing Library

### Project Structure

```
src/
├── pages/              # Route-level components
│   ├── Index.tsx       # Redirects to /auth or Dashboard
│   ├── Editor.tsx      # Paper editor with AI copilot
│   ├── Auth.tsx        # Authentication page
│   └── NotFound.tsx
├── components/
│   ├── ui/             # shadcn/ui components (50+)
│   ├── EditorPane.tsx  # Text editor component
│   ├── AICopilotPane.tsx   # AI suggestions sidebar
│   └── VersionSidebar.tsx  # Version history sidebar
├── hooks/
│   ├── useAuth.tsx     # Authentication context with roles
│   └── usePapers.ts    # Paper CRUD operations
├── integrations/supabase/
│   ├── client.ts       # Supabase client initialization
│   └── types.ts        # Generated database types
└── test/setup.ts       # Test environment setup
```

### Database Schema

Key tables in Supabase:
- `profiles` - User profiles with full_name, avatar_url
- `user_roles` - Role assignments (student/advisor/director)
- `papers` - Academic papers with content, status, word_count
- `paper_versions` - Version history with full content snapshots
- `student_advisor` - Many-to-many student-advisor relationships

All tables have Row Level Security (RLS) enabled with policies based on roles:
- Students can CRUD their own papers
- Advisors can view their supervised students' papers
- Directors can view all papers

### Authentication & Roles

The `useAuth` hook provides:
- `user` - Supabase User object
- `profile` - User's profile data
- `roles` - Array of app_role enum values
- `signOut` - Sign out function

Roles are defined in `app_role` enum: 'student', 'advisor', 'director'.

### Data Fetching Pattern

Uses TanStack React Query with custom hooks in `src/hooks/`:
- `usePapers()` - Fetch all papers for current user
- `useCreatePaper()` - Create new paper (invalidates papers cache)
- `useUpdatePaper()` - Update paper content
- `usePaperVersions(paperId)` - Fetch version history
- `useSaveVersion()` - Save a new version snapshot

### Path Aliases

The `@` alias maps to `./src` in both Vite and Vitest configurations.

## Testing

- Tests are located in `src/**/*.test.ts` or `src/**/*.spec.ts`
- Test environment is jsdom with React Testing Library
- Setup file at `src/test/setup.ts` includes matchMedia mock

## Important Notes

- The dev server runs on port 8080 (configured in vite.config.ts)
- The AI copilot currently uses mock suggestions (citation, structure, clarity, next-step)
- Fonts: Playfair Display (headings) + Source Serif 4 (body) for academic aesthetic

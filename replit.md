# MathLearn - Interactive Mathematics Learning Platform

## Overview

MathLearn is a full-stack web application designed to teach mathematics from beginner to advanced levels with a focus on interactive, visual learning similar to Brilliant.org. The platform provides structured math courses with interactive examples, progress tracking, and user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18+ with TypeScript**: Modern React application using functional components and hooks
- **Vite**: Fast build tool and development server for optimal development experience
- **Wouter**: Lightweight routing library for client-side navigation
- **shadcn/ui**: Component library built on Radix UI primitives with Tailwind CSS styling
- **TanStack Query**: Data fetching, caching, and synchronization library
- **Canvas/SVG**: Interactive visualizations for mathematical concepts

### Backend Architecture
- **Express.js**: Node.js web framework serving as the REST API server
- **TypeScript**: Type-safe server-side development
- **Replit Authentication**: OAuth-based authentication system for user management
- **Express Session**: Session management with PostgreSQL storage

### Data Storage Solutions
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database query builder and migration tool
- **Session Storage**: PostgreSQL-backed session storage for authentication

## Key Components

### Authentication System
- Replit OAuth integration for seamless authentication
- Session-based authentication with PostgreSQL storage
- User profile management with progress tracking

### Course Management
- Hierarchical course structure (courses → lessons → quizzes)
- Difficulty levels: beginner, intermediate, advanced
- Interactive content with visual examples and animations

### Progress Tracking
- User progress persistence across courses and lessons
- Achievement system and statistics tracking
- Time-based learning analytics

### Interactive Learning Components
- **InteractiveGraph**: Canvas-based mathematical visualizations
- **QuizModal**: Interactive quiz system with explanations
- Real-time manipulation of mathematical parameters

## Data Flow

1. **Authentication Flow**:
   - User authenticates via Replit OAuth
   - Session created and stored in PostgreSQL
   - User data synchronized with application database

2. **Learning Flow**:
   - User selects course from available options
   - Progresses through structured lessons
   - Completes interactive quizzes and exercises
   - Progress automatically saved and tracked

3. **Data Persistence**:
   - All user interactions stored in PostgreSQL
   - Real-time progress updates via TanStack Query
   - Optimistic updates for smooth user experience

## External Dependencies

### Authentication
- **Replit Authentication**: OAuth provider for user authentication
- **OpenID Connect**: Standard protocol for authentication flow

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database hosting
- **Connection pooling**: Managed via @neondatabase/serverless

### UI/UX
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool with HMR and optimized bundling
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Type checking and development tooling

## Deployment Strategy

### Development Environment
- Replit-hosted development with live reloading
- Vite dev server with proxy configuration
- PostgreSQL database provisioned via environment variables

### Production Build
- Vite builds optimized client bundle
- ESBuild compiles server code for Node.js production
- Static assets served from Express server

### Database Management
- Drizzle migrations for schema management
- Database credentials managed via environment variables
- Connection pooling for production scalability

### Key Architectural Decisions

1. **Monorepo Structure**: Frontend, backend, and shared code in single repository for easier development and deployment
2. **Type Safety**: Full TypeScript implementation across frontend, backend, and database schemas
3. **Modern React Patterns**: Functional components, hooks, and context for state management
4. **Component-Based UI**: shadcn/ui provides consistent, accessible components
5. **Database-First Design**: Drizzle schema as source of truth with type generation
6. **Session-Based Auth**: Replit OAuth with PostgreSQL session storage for security
7. **Interactive Learning**: Canvas-based visualizations for mathematical concepts
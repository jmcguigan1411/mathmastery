# MathLearn Project Setup Guide

## Quick Setup Instructions

### 1. Create New Project Directory
```bash
mkdir mathlearn-project
cd mathlearn-project
```

### 2. Initialize Node.js Project
```bash
npm init -y
```

### 3. Install Dependencies
```bash
# Core dependencies
npm install @hookform/resolvers @neondatabase/serverless @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip @tanstack/react-query chart.js class-variance-authority clsx cmdk connect-pg-simple d3 date-fns drizzle-orm drizzle-zod embla-carousel-react express express-session framer-motion input-otp katex lucide-react mathjs memoizee memorystore nanoid next-themes openid-client passport passport-local react react-chartjs-2 react-day-picker react-dom react-hook-form react-icons react-resizable-panels recharts tailwind-merge tailwindcss-animate tw-animate-css vaul wouter ws zod zod-validation-error

# Dev dependencies
npm install -D @types/connect-pg-simple @types/express @types/express-session @types/node @types/passport @types/passport-local @types/react @types/react-dom @types/ws @vitejs/plugin-react autoprefixer drizzle-kit esbuild postcss tailwindcss tsx typescript vite
```

### 4. Project Structure
Create the following directories:
```
mathlearn-project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
│   └── index.html
├── server/
├── shared/
└── (config files)
```

### 5. Database Setup
- Set up PostgreSQL database (Neon, Railway, or local)
- Add DATABASE_URL environment variable
- Run: `npm run db:push`

### 6. Environment Variables
Create `.env` file:
```
DATABASE_URL=your_postgres_url
SESSION_SECRET=your_session_secret
REPL_ID=your_repl_id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your_domain.replit.app
```

### 7. Start Development
```bash
npm run dev
```

## Key Features
- Full-stack TypeScript application
- PostgreSQL database with Drizzle ORM
- React frontend with shadcn/ui components
- Interactive mathematical visualizations with D3.js
- Authentication with Replit OAuth
- Progress tracking and achievements
- Quiz system with explanations
- Dark/light mode support

## File Dependencies
All source files are provided in the project. Follow the exact file structure and content for proper functionality.
# Overview

This is a full-stack web application built with React and Express.js featuring user authentication and registration. The system provides a secure login/registration interface with password strength validation, session management, and a dashboard for authenticated users. The application uses a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components for the frontend, and Express.js with Drizzle ORM for the backend.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in SPA mode
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with configurable storage
- **Authentication**: Custom implementation with bcrypt for password hashing
- **API Design**: RESTful API endpoints for authentication operations
- **Storage Abstraction**: Interface-based storage layer supporting both in-memory and database implementations

## Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL with Neon serverless database support
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Fallback Storage**: In-memory storage implementation for development/testing

## Authentication and Authorization
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Session Management**: Express sessions with configurable expiration
- **Session Storage**: PostgreSQL-based session store with automatic cleanup
- **Validation**: Zod schemas for input validation on both client and server
- **Security Headers**: Configured for production deployment

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database provider
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **Radix UI**: Unstyled, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience
- **ESLint/Prettier**: Code formatting and linting (configured via package.json)

### Authentication
- **bcrypt**: Password hashing library
- **express-session**: Session middleware for Express

### State Management
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution

### Form Handling
- **React Hook Form**: Performant form library
- **Zod**: Schema validation library
- **@hookform/resolvers**: Integration between React Hook Form and Zod
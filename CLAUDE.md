# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TanStack Query (React Query) example repository demonstrating the usage of `useQuery`, `useMutation`, and `useInfiniteQuery` with tRPC and Next.js. Built using the T3 Stack, it combines Next.js App Router, tRPC, TanStack Query, TypeScript, and Tailwind CSS.

## Development Commands

All commands should be run from the `app/` directory:

```bash
# Development
cd app
pnpm dev              # Start development server with Turbo
pnpm build            # Build for production
pnpm start            # Start production server
pnpm preview          # Build and start production server

# Code Quality
pnpm check            # Run linter AND type check
pnpm typecheck        # Type check only (tsc --noEmit)
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format:check     # Check Prettier formatting
pnpm format:write     # Fix Prettier formatting

# Database
pnpm db:generate      # Generate Drizzle migrations from schema
pnpm db:migrate       # Run pending migrations
pnpm db:push          # Push schema changes directly to database
pnpm db:studio        # Open Drizzle Studio (visual database explorer)
pnpm db:seed:postgres # Seed PostgreSQL with asset data from assets.json
pnpm db:seed:mongo    # Seed MongoDB with asset data
```

Package manager: **pnpm** (specified in `app/package.json`)

## Architecture

### tRPC + TanStack Query Integration

The app uses tRPC with TanStack Query (React Query) for type-safe API calls. There are **two distinct patterns** for using tRPC:

#### 1. Server Components (RSC)

- File: `src/trpc/server.ts`
- Import: `import { api } from "@/trpc/server"`
- Use directly in React Server Components
- Provides server-side hydration helpers via `HydrateClient`

#### 2. Client Components

- File: `src/trpc/react.tsx`
- Import: `import { api } from "@/trpc/react"`
- Wraps components with `TRPCReactProvider`
- Use `api.procedureName.useQuery()`, `api.procedureName.useMutation()`, etc.

**IMPORTANT**: The `api` export has different capabilities depending on which file it's imported from. Server-side `api` is for direct async calls; client-side `api` is for React hooks.

### Directory Structure

```
app/src/
├── app/                    # Next.js App Router
│   ├── _components/        # Private components (prefixed with _)
│   ├── _hooks/             # Private hooks
│   ├── _docs/              # TanStack Query documentation (see below)
│   ├── api/trpc/[trpc]/   # tRPC API handler
│   ├── layout.tsx         # Root layout with TRPCReactProvider
│   └── page.tsx           # Home page
├── server/
│   ├── api/
│   │   ├── root.ts        # Main tRPC router (exports AppRouter type)
│   │   ├── trpc.ts        # tRPC initialization, context, procedures
│   │   ├── routers/       # Individual route handlers
│   │   └── assets/        # Static data (assets.json for seeding)
│   └── db/
│       ├── postgres.ts    # PostgreSQL connection with Drizzle ORM
│       ├── mongodb.ts     # MongoDB connection with Mongoose
│       ├── seed-postgres.ts # PostgreSQL seeding script
│       ├── seed-mongodb.ts  # MongoDB seeding script
│       └── schemas/       # Database schemas (Drizzle & Mongoose)
├── trpc/
│   ├── query-client.ts    # QueryClient configuration
│   ├── react.tsx          # Client-side tRPC React hooks
│   └── server.ts          # Server-side tRPC caller
├── styles/                # Global styles
└── env.js                 # Environment variable validation (t3-env)
```

### Key Technical Patterns

#### tRPC Router Structure

- Routers defined in `src/server/api/routers/` using `createTRPCRouter` and `publicProcedure`
- All routers must be registered in `src/server/api/root.ts` (the `appRouter`)
- Export `AppRouter` type from `root.ts` for end-to-end type safety
- Current routers: `carousel`, `table`, `infinite`, `mutation`, `query`

#### Middleware

- `timingMiddleware` adds artificial delay (100-500ms) in development to simulate network latency
- Helps catch unwanted request waterfalls
- Can be removed if not needed (defined in `src/server/api/trpc.ts`)

#### Type Inference

Use the helper types from `src/trpc/react.tsx`:

```typescript
import { type RouterInputs, type RouterOutputs } from "@/trpc/react";
type HelloInput = RouterInputs["post"]["hello"];
type HelloOutput = RouterOutputs["post"]["hello"];
```

#### Environment Variables

- Validated using `@t3-oss/env-nextjs` in `src/env.js`
- Server vars: define in `server` schema
- Client vars: define in `client` schema with `NEXT_PUBLIC_` prefix
- **ALWAYS** update `src/env.js` when adding new environment variables

#### Path Aliases

- `@/*` maps to `src/*` (configured in `tsconfig.json`)
- Use absolute imports: `import { api } from "@/trpc/react"`

### Database Architecture

The project supports **dual database backends** (PostgreSQL and MongoDB) for flexibility:

#### PostgreSQL + Drizzle ORM

- **Connection**: `src/server/db/postgres.ts` - Uses connection pooling via `pg.Pool`
- **Schema**: `src/server/db/schemas/asset.drizzle.ts` - Drizzle schema definitions
- **ORM**: Drizzle ORM with type-safe queries
- **Configuration**: `drizzle.config.ts` at project root
- **Migrations**: Generated in `drizzle/` directory
- **Seeding**: Run `pnpm db:seed:postgres` to populate from `src/server/api/assets/assets.json`

#### MongoDB + Mongoose

- **Connection**: `src/server/db/mongodb.ts` - Uses cached connection for serverless
- **Schema**: `src/server/db/schemas/asset.mongoose.ts` - Mongoose models with Typegoose
- **Global caching**: Implements `global.mongooseCache` pattern for Next.js serverless
- **Seeding**: Run `pnpm db:seed:mongo` to populate from `src/server/api/assets/assets.json`

**Note**: Both databases use the same source data file (`assets.json`) containing cryptocurrency asset information. Seeding scripts transform MongoDB extended JSON format to their respective database formats.

#### Environment Setup

Required environment variables (`.env`):

```bash
DATABASE_URL=postgresql://user:pass@host:port/database  # For PostgreSQL
MONGODB_URI=mongodb://user:pass@host:port/database      # For MongoDB
```

Both must be defined in `src/env.js` schema for validation.

## Documentation

The repository includes comprehensive TanStack Query documentation in `app/src/app/_docs/`:

- **MUTATIONS.md**: Complete guide to `useMutation`, side effects, optimistic updates, retries, and persistence
- **OPTIMISTIC_UPDATES.md**: Two approaches for optimistic UI updates (via UI and via cache)
- **INFINITE_QUERY.md**: Reference for `useInfiniteQuery` with pagination parameters
- **PAGINATED_QUERIES.md**: Paginated query patterns and implementations
- **QUERY_KEYS.md**: Query key structure and best practices
- **QUERY_FUNCTIONS.md**: Query function patterns and data fetching
- **INITIAL_QUERY_DATA.md**: Setting initial data for queries
- **USE_QUERIES.md**: Using multiple queries in parallel (`useQueries`)
- **GENERIC_CAROUSEL.md**: Generic carousel component documentation
- **USE_CAROUSEL_CONTROLLER.md**: Carousel controller hook documentation

Refer to these files when implementing TanStack Query patterns.

## TypeScript Configuration

- Strict mode enabled with `noUncheckedIndexedAccess`
- Uses verbatim module syntax
- Target: ES2022 with ESNext modules

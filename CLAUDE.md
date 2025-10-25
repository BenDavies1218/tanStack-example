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
|   |   _hooks/             # Private hooks
|   |   _docs/              # All Documentation
│   ├── api/trpc/[trpc]/   # tRPC API handler
│   ├── layout.tsx         # Root layout with TRPCReactProvider
│   └── page.tsx           # Home page
├── server/
│   └── api/
│       ├── root.ts        # Main tRPC router (exports AppRouter type)
│       ├── trpc.ts        # tRPC initialization, context, procedures
│       └── routers/       # Individual route handlers (e.g., post.ts)
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

## TanStack Query Resources

The repository includes comprehensive documentation files in the root directory:

- **MUTATIONS.md**: Complete guide to `useMutation`, side effects, optimistic updates, retries, and persistence
- **OPTIMISTIC_UPDATES.md**: Two approaches for optimistic UI updates (via UI and via cache)
- **INFINITE_QUERY.md**: Reference for `useInfiniteQuery` with pagination parameters

Refer to these files when implementing mutations, infinite queries, or optimistic update patterns.

## Documenation

- app/src/app/\_docs/\*

## TypeScript Configuration

- Strict mode enabled with `noUncheckedIndexedAccess`
- Uses verbatim module syntax
- Target: ES2022 with ESNext modules

# Ekklesia - Project Guidelines for Claude

## Project Overview

Ekklesia is a multi-tenant web and mobile platform for managing church councils (concilios) and their congregations. It handles organizational structure (councils, parent/child churches, societies), member management with role assignments, service and activity scheduling with conflict resolution, internal messaging, birthday tracking, and contribution (donations/offerings/tithes) recording with treasury-controlled reporting. Each tenant (council) has isolated data, custom branding, and its own domain.

---

## CRITICAL RULES (MANDATORY - DO NOT SKIP)

- **ALWAYS use Context7 for documentation lookups.**
- **NEVER add Co-Authored-By, Claude, or Anthropic references in git commit messages, PR titles, PR descriptions, or code comments.** No references to AI assistants, code generation tools, or third-party AI providers anywhere in the codebase or version control history.
- **ALWAYS use semantic/conventional commits** (e.g., `feat(auth): add login form`, `fix(user): resolve avatar bug`).
- **NEVER use emojis** in commit messages, PR titles, PR descriptions, or code comments.
- **ALWAYS create a new branch from an updated `main`** for every implementation. Pull latest changes before branching. Open a PR against `main` when done. Never push directly to `main`.
- **ALWAYS follow Feature-Sliced Design (FSD) architecture strictly.** See `.claude/architecture.md`.
- **ALWAYS use shadcn/ui Component Library** -- reuse and customize components.
- **ALWAYS use Tailwind CSS** -- prefer Tailwind classes instead of inline styles or CSS modules.
- **ALWAYS write code in English** -- all code, comments, and variable names.
- **ALWAYS use Server Components by default** -- only add `'use client'` when strictly necessary.
- **ALWAYS use Axios for all HTTP requests** -- never use `fetch` directly in client-side code. Axios instances must be configured via `@/shared/api`. See `.claude/data-fetching.md`.
- **EVERY test MUST validate business logic.** Tests that check CSS classes, DOM structure, snapshots, or implementation details are prohibited. See `.claude/testing.md`.
- **The main agent NEVER implements code directly.** It orchestrates and delegates to specialized agents. See `.claude/agents.md`.

---

## Tech Stack

- Next.js 16+ (App Router, Server Components, Server Actions)
- React 19+ / TypeScript 5.9+ (strict mode)
- Tailwind CSS v4+ / shadcn/ui 4+
- TanStack Query 5.84+ / Zustand 5+
- React Hook Form 7+ / Zod 4+
- Axios 1.13+ (client) / fetch (server)
- Vitest 4+ / React Testing Library / Playwright 1.58+
- Storybook 10+ / ESLint 9+ / Prettier 3.4+
- pnpm 10+

---

## Quick Reference

| Topic                      | File                       |
| -------------------------- | -------------------------- |
| FSD layers and structure   | `.claude/architecture.md`  |
| Naming, imports, style     | `.claude/conventions.md`   |
| Testing rules              | `.claude/testing.md`       |
| Branch and PR workflow     | `.claude/git-workflow.md`  |
| Data fetching, HTTP, proxy | `.claude/data-fetching.md` |
| Agent orchestration        | `.claude/agents.md`        |

---

## Development Commands

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| `pnpm install`       | Install dependencies                        |
| `pnpm run dev`       | Start dev server at `http://localhost:3000` |
| `pnpm run build`     | Production build                            |
| `pnpm run start`     | Start production server                     |
| `pnpm run typecheck` | TypeScript type checking                    |
| `pnpm run test`      | Run unit tests (watch mode)                 |
| `pnpm run test:run`  | Run unit tests once                         |
| `pnpm run test:e2e`  | Run E2E tests                               |
| `pnpm run lint`      | Run ESLint                                  |
| `pnpm run lint:fix`  | ESLint with auto-fix                        |
| `pnpm run format`    | Format with Prettier                        |
| `pnpm run storybook` | Start Storybook                             |
| `pnpm run release`   | Version bump + CHANGELOG                    |

---

## Environment Variables

- Server-only: `API_URL`, `DATABASE_URL`, `JWT_SECRET` (no prefix)
- Client-exposed: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_NAME`
- Access via `@/shared/config` -- never read `process.env` directly outside shared config
- Validate at build time with Zod schema in `shared/config/env.ts`

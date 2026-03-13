# Architecture: Feature-Sliced Design (FSD) + Next.js App Router

## Layer Structure (Top to Bottom)

```
src/
├── app/          # Next.js App Router (routing + bootstrap)
├── pages/        # FSD page-level compositions
├── widgets/      # Large reusable UI blocks
├── features/     # User-facing use cases
├── entities/     # Business domain objects
└── shared/       # Domain-agnostic utilities
```

## Layer Dependency Rules

| Layer        | Purpose                                           | Can Import From                            |
| ------------ | ------------------------------------------------- | ------------------------------------------ |
| **app**      | Bootstrap: routing, providers, layouts, proxy     | shared, entities, features, pages, widgets |
| **pages**    | Route-level compositions of features/widgets      | shared, entities, features, widgets        |
| **widgets**  | Large reusable UI blocks (nav, sidebars)          | shared, entities, features                 |
| **features** | User-facing use cases (login, checkout)           | shared, entities                           |
| **entities** | Core business objects (User, Plan, Payment)       | shared                                     |
| **shared**   | Domain-agnostic code (UI primitives, utils)       | (nothing - completely independent)         |

**Strict rules:**

- Lower layers can be used by upper layers
- Upper layers CANNOT be imported by lower layers
- Features CANNOT import from other features
- Shared CANNOT import from any other layer
- Use public API via `index.ts` for each slice

## Mapping FSD to Next.js App Router

```
src/
├── app/                          # Next.js App Router (thin shells only)
│   ├── layout.tsx                # Root layout: providers, global styles
│   ├── proxy.ts                  # Auth guards, redirects, rewrites
│   ├── (auth)/
│   │   ├── login/page.tsx        # Thin shell -> imports from pages/
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── customers/page.tsx
│   │   └── billing/page.tsx
│   └── api/                      # Route Handlers
├── pages/                        # FSD pages layer
│   └── customers/
│       ├── index.ts
│       └── ui/
│           └── CustomersPage.tsx # Composes widgets + features
├── widgets/
├── features/
├── entities/
└── shared/
```

`app/` route files (`page.tsx`, `layout.tsx`) MUST be thin shells that import from the FSD `pages/` layer. No business logic in `app/` route files.

## Feature/Entity Internal Structure

```
feature-name/
├── index.ts          # Public API (exports only what is needed)
├── model/
│   ├── types.ts      # TypeScript interfaces
│   └── hooks.ts      # Feature-specific custom hooks
├── api/
│   ├── featureApi.ts # API call functions
│   └── actions.ts    # Next.js Server Actions ('use server')
└── ui/
    └── FeatureComponent.tsx
```

## Server vs Client Components

- Server Components (default): data fetching, static content, SEO-critical content, layouts
- Client Components ('use client'): interactivity, hooks (useState, useEffect), event handlers, browser APIs
- Place 'use client' boundary as deep as possible in the component tree
- Never pass functions as props from Server to Client components

## Cross-Feature Communication

Features CANNOT import from other features. When communication is needed:

- Shared data: extract to an entity
- Events: typed event emitter in `shared/lib/` or React Context from parent
- Coordinated actions: pages and widgets orchestrate multiple features
- URL state: features can read shared URL params via `useSearchParams`

## API Types Strategy

- Persistence types (API shape) live in the slice's `api/` folder
- Domain models live in the slice's `model/types.ts`
- Use class-based Mapper pattern with base `Mapper<Domain, Persistence>` in `shared/lib/mapper.ts`
- Every mapper implements `toDomain(raw)` and `toPersistence(domain)`
- Never use `any` in mapper signatures
- Never use API responses directly in components -- always go through the mapper

## i18n Strategy

- All user-facing text through `next-intl` -- no hardcoded strings
- Keys follow namespace pattern: `feature.component.key`
- Translation files per locale in `shared/i18n/messages/`
- Server Components: `getTranslations()`
- Client Components: `useTranslations()` hook

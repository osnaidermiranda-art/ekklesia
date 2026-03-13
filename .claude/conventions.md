# Code Conventions

## TypeScript

- Use `import type` for type-only imports
- Use `interface` for objects, `type` for unions/primitives
- Define explicit return types for exported functions
- Never use `any` -- use `unknown` if type is truly unknown
- Strict mode enabled: `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`

## React Components

- Always use functional components with arrow function syntax
- Define `displayName` for components exported as default or wrapped in HOCs/memo/forwardRef
- Type props with `interface` -- never inline prop types
- Prefer named exports over default exports (except `page.tsx`/`layout.tsx`)
- Use Tailwind utilities instead of CSS modules or styled-components
- Use semantic HTML
- Colocate hooks at the top of the component body, before any conditionals

```tsx
interface UserProfileProps {
    userId: string
    showAvatar?: boolean
}

export const UserProfile = ({ userId, showAvatar = true }: UserProfileProps) => {
    const { data: user } = useUserQuery(userId)

    if (!user) return <UserProfileSkeleton />

    return (
        <section className="flex items-center gap-4">
            {showAvatar && <UserAvatar src={user.avatar} />}
            <h2 className="text-lg font-semibold">{user.name}</h2>
        </section>
    )
}
```

## Formatting (Prettier)

No semicolons, single quotes, 4-space indent, trailing commas (ES5), 100 char line width, JSX single quotes.

## Naming Conventions

| Type                 | Convention                  | Example                                   |
| -------------------- | --------------------------- | ----------------------------------------- |
| **Components**       | PascalCase                  | `UserProfile.tsx`, `LoginForm.tsx`         |
| **Hooks**            | camelCase with `use` prefix | `useDebounce.ts`, `useAuth.ts`            |
| **Types/Interfaces** | PascalCase                  | `User`, `LoginPayload`                    |
| **Constants**        | UPPER_SNAKE_CASE            | `API_TIMEOUT`, `MAX_RETRIES`              |
| **Functions**        | camelCase                   | `fetchUser()`, `validateEmail()`          |
| **Files**            | Match export name           | `userApi.ts`                              |
| **Folders**          | kebab-case                  | `auth/`, `user-profile/`                  |
| **Server Actions**   | camelCase with verb prefix  | `createCustomer()`, `updateBilling()`     |

## Imports

- Use `@/` alias for all cross-layer imports -- never relative paths across layers
- Order: React -> Next.js -> third-party -> `@/shared` -> `@/entities`/`@/features` -> local
- Group imports with blank lines between groups

```tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'

import { useUserQuery } from '@/entities/user'

import { UserProfile } from './ui/UserProfile'
```

## State Management

- Server state: TanStack Query (useQuery/useMutation) for Client Components. `fetch` or Server Actions for Server Components.
- Client state: React hooks (useState, useReducer) for local UI state. Zustand ONLY for cross-feature client state.
- URL state: `nuqs` or `useSearchParams` for filter/sort/pagination state.
- Form state: React Hook Form with Zod schemas for all forms.

## Zustand Rules

- Stores live in `shared/store/` or within a specific entity's `model/`
- Keep stores minimal -- prefer TanStack Query for server data
- Never duplicate server state in Zustand
- Use selectors to prevent unnecessary re-renders

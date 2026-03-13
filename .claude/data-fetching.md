# Data Fetching, HTTP Clients, and Proxy

## Server Components (Preferred)

```tsx
// pages/customers/ui/CustomersPage.tsx (Server Component)
import { getCustomers } from '@/entities/customer'

export async function CustomersPage() {
    const customers = await getCustomers()

    return (
        <section>
            <h1>Customers</h1>
            <CustomerList customers={customers} />
        </section>
    )
}
```

## Client Components (When interactivity needed)

```tsx
// features/customer-search/ui/CustomerSearch.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { searchCustomers } from '@/entities/customer'

export function CustomerSearch() {
    const [query, setQuery] = useState('')
    const { data, isLoading } = useQuery({
        queryKey: ['customers', 'search', query],
        queryFn: () => searchCustomers(query),
        enabled: query.length > 2,
    })

    return (/* ... */)
}
```

## Server Actions

```tsx
// features/create-customer/api/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { customerSchema } from '../model/schema'

export async function createCustomer(formData: FormData) {
    const parsed = customerSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { error: parsed.error.flatten() }

    await apiClient.post('/customers', parsed.data)
    revalidatePath('/customers')
    return { success: true }
}
```

## HTTP Client -- Client-side

Use the configured `apiClient` from `@/shared/lib/http/client.ts`. Never create new Axios instances. It handles: base URL (`NEXT_PUBLIC_API_URL`), 15s timeout, Bearer token injection, 401 auto-logout.

## HTTP Client -- Server-side

Use `serverFetch` from `@/shared/lib/http/server.ts`. Reads auth tokens from cookies via `next/headers`. Never import the client-side Axios instance in Server Components or Server Actions.

```tsx
// shared/lib/http/server.ts
import { cookies } from 'next/headers'

export async function serverFetch(path: string, options?: RequestInit) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    return fetch(`${process.env.API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers,
        },
    })
}
```

## Proxy (formerly Middleware)

Next.js 16 breaking change: `middleware.ts` has been renamed to `proxy.ts` and the exported function is now `proxy()`. The runtime is exclusively `nodejs` -- `edge` runtime is no longer supported. Config flags like `skipMiddlewareUrlNormalize` are now `skipProxyUrlNormalize`.

Location: `src/app/proxy.ts`

```tsx
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const isAuthPage = request.nextUrl.pathname.startsWith('/login')

    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
```

## Error Handling

- Use Next.js `error.tsx` boundaries at route segment level for unexpected errors
- Use `not-found.tsx` for 404 handling
- Use `loading.tsx` for Suspense boundaries at route level
- Centralize API error handling in `QueryClient` default `onError` (client-side)
- Backend errors must include a `code` field. Map codes to i18n keys globally
- 401/403 handled centrally by `apiClient` interceptor (client) or `proxy.ts` (server)
- Only add `onError` in a feature when additional logic beyond the toast is needed
- Never silently swallow errors

```
app/
├── error.tsx           # Global error boundary
├── not-found.tsx       # Global 404
├── (dashboard)/
│   ├── error.tsx       # Dashboard-specific error boundary
│   ├── loading.tsx     # Dashboard loading skeleton
│   └── customers/
│       ├── error.tsx   # Customers error boundary
│       ├── loading.tsx # Customers loading skeleton
│       └── page.tsx
```

# Testing Strategy

## MANDATORY -- Business Logic Only

Every test MUST validate business logic and deliver value to the product. Tests that do not verify business rules, user workflows, or domain behavior are prohibited and must not be created.

### Forbidden Test Patterns (never write these)

- Asserting CSS classes, colors, font sizes, or visual styles (`expect(el).toHaveClass('bg-red-500')`)
- Checking DOM structure, tag names, or element count (`expect(container.querySelectorAll('div')).toHaveLength(3)`)
- Verifying that a component renders without crashing (smoke tests with no assertions on behavior)
- Snapshot tests of markup or rendered output
- Testing that props are passed to child components (implementation coupling)
- Asserting internal state values or hook return shapes

### Valid Test Patterns (always write these)

- User submits a form with invalid data -> validation error is shown
- User creates a customer -> customer appears in the list
- Billing calculation applies discount correctly -> total reflects the discount
- Unauthenticated user tries to access dashboard -> gets redirected to login
- Payment fails -> error message is displayed and retry is available
- Mapper transforms API response -> domain model has correct computed fields

### The Litmus Test

Before writing any test, ask: "Does this test break only when a business rule changes?" If it breaks because of a refactor, style change, or internal restructuring that does not affect behavior -- it is a bad test and must not exist.

## Test Infrastructure

- **Unit tests:** Vitest 2.1+ with React Testing Library. Co-located as `ComponentName.test.tsx`
- **E2E tests:** Playwright 1.58+. In `e2e/` directory. Runs against `http://localhost:3000` on Chromium, Firefox, WebKit
- **Storybook:** Co-located `*.stories.tsx` files for component documentation

## Guidelines

- Prefer integration tests over unit tests. Test components with their real children and hooks together.
- Only isolate with unit tests when testing pure logic (utils, helpers, mappers, validators).
- Server Components: test via E2E or test data-fetching functions as unit tests. Do not render Server Components in Vitest.
- Server Actions: test as plain async functions in Vitest by mocking Next.js server imports.

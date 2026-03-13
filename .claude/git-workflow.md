# Git Workflow

## MANDATORY -- Branch and PR Workflow

Every implementation MUST follow this exact workflow. No exceptions.

1. Pull latest changes from `main`:

   ```bash
   git switch main
   git pull origin main --rebase
   ```

2. Create a new branch from the updated `main`:

   ```bash
   git switch -c <type>/<branch-name>
   ```

3. Implement the task. Commit frequently with conventional commits.

4. Push the branch and create a Pull Request against `main`:
   ```bash
   git push origin <type>/<branch-name>
   ```

## Commit Convention

Format: `<type>(<scope>): <subject>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

Examples:

```bash
feat(auth): add login form with email validation
fix(user): resolve avatar loading issue on slow connections
refactor(shared): extract button variants to separate file
test(billing): add integration test for discount calculation
chore(deps): upgrade next to 15.2
```

Rules:

- No emojis in commit messages
- No references to AI assistants or code generation tools
- Subject line in imperative mood, lowercase, no period at the end

## PR Rules

- Title MUST follow conventional commit format (e.g., `feat(auth): add login flow`)
- Description MUST be written entirely in English
- Description MUST NOT contain any reference to AI assistants, code generation tools, or third-party AI providers
- Description MUST summarize what changed, why it changed, and how to test it
- No emojis in PR title, description, or commit messages
- Never push directly to `main` -- always go through a PR

## Branching Strategy

- `main` - Production branch
- Feature branches: `feat/feature-name`
- Bug fixes: `fix/bug-description`
- Refactoring: `refactor/what-changed`

## Versioning

```bash
pnpm run release          # Patch (0.0.x) - bug fixes
pnpm run release:minor    # Minor (0.x.0) - new features
pnpm run release:major    # Major (x.0.0) - breaking changes
```

Auto-generates `CHANGELOG.md` from commit messages.

## Pre-commit Hooks

Automatically runs on commit:

1. ESLint with auto-fix on `*.{js,ts,tsx}`
2. Prettier formatting on all files
3. TypeScript type checking
4. Unit tests

If hooks fail:

- `pnpm run lint:fix` -- fix linting errors
- `pnpm run format` -- fix formatting
- `pnpm run test:run` -- fix tests
- `pnpm run typecheck` -- fix types

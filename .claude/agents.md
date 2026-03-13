# Agent and Skill Orchestration

## MANDATORY -- Orchestrator Principle

The main agent acts exclusively as an orchestrator. It MUST delegate all implementation tasks to the specialized agents and skills listed below. The main agent analyzes the request, determines which agents are needed, coordinates their execution, and validates the output -- but NEVER writes code, styles, tests, or any implementation artifact itself. If no specialized agent matches the request, the main agent must identify and assign the closest skill combination before proceeding. Violating this delegation rule is never acceptable.

## Agent Routing Table

| Request Type                | Primary Agent                              |
| --------------------------- | ------------------------------------------ |
| React components/hooks      | `react-expert`                             |
| Complex TypeScript          | `typescript-pro`                           |
| UI/UX design, styling       | `frontend-design` + `tailwind-patterns`    |
| New feature                 | `react-expert` + `test-driven-development` |
| Bug fix                      | `test-driven-development` + `react-expert` |
| Code review / PR            | `code-reviewer`                            |
| Refactoring                 | `refactoring-specialist`                   |
| Testing strategy            | `qa-expert`                                |
| Scaffolding / bundle        | `senior-frontend`                          |
| API documentation           | `api-documenter`                           |
| Server Components / RSC     | `react-expert` + `nextjs-specialist`       |
| Data fetching / caching     | `nextjs-specialist`                        |

## Always Active Skills

These skills MUST be applied regardless of the request type:

- `test-driven-development` -- MANDATORY for all features and bugfixes
- `code-reviewer` -- after more than 5 files changed or before creating a PR
- `tailwind-patterns` -- any component that involves styling
- `typescript-pro` -- when `any` appears or complex generics are needed

# AGENTS.md — AuditKit

Guidelines for AI coding agents working in this repository.

## Project

AuditKit is a full-stack website and GitHub repo auditor. It collects data from multiple sources in parallel, scores across 6 pillars, and generates AI agent briefs that fix detected issues.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Monorepo**: pnpm workspaces, Turborepo
- **Packages**: `@auditkit/collectors`, `@auditkit/scorer`, `@auditkit/analyzer`, `@auditkit/generator`
- **No database** — all results are ephemeral (v1)

## Directory Map

```
apps/web/src/
  app/             → Next.js App Router pages + API routes
  components/      → React components
  lib/utils.ts     → shared helpers

packages/
  collectors/src/  → one file per data source, all return CollectorResult<T>
  scorer/src/      → pure functions: raw data → PillarScore[]
  analyzer/src/    → orchestrates collectors, calls scorer, returns AuditResult
  generator/src/   → AuditResult → ZIP blob with AGENTS.md, skill files, etc.
```

## Commands

```bash
pnpm dev              # start Next.js dev server
pnpm build            # build all packages
pnpm type-check       # TypeScript check across all packages
```

## Adding a Collector

1. Create `packages/collectors/src/{name}.ts`
2. Export `async function collect{Name}(url: string): Promise<CollectorResult<YourDataType>>`
3. Add your data type to `packages/collectors/src/types.ts`
4. Export from `packages/collectors/src/index.ts`
5. Add a scorer in `packages/scorer/src/index.ts`
6. Wire into `packages/analyzer/src/index.ts`

## Key Conventions

- All collector functions use `Promise.allSettled` / `AbortSignal.timeout` — never let one slow API block others
- Scores are always 0–100, clamped with `Math.max(0, Math.min(100, score))`
- Issues have `severity: 'critical' | 'warning' | 'info'` — critical should deduct ≥15 points
- No database — results live only in the HTTP response (ephemeral)
- Prefer interfaces over types for object shapes

## Important: Do NOT

- Add authentication or database in Phase 1
- Run `pnpm test` without a file pattern — it runs everything
- Change the ZIP structure in `packages/generator/src/index.ts` without updating the README

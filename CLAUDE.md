# CLAUDE.md — AuditKit

Guidelines for Claude Code in this repository.

## Project

AuditKit is a **zero-API-key** website and GitHub repo auditor. Enter a URL, get scores across 6 pillars (Performance, SEO, Accessibility, Security, Structured Data, AI Readiness), then download a ZIP with AI agent files pre-written to fix every issue.

> No API keys required. PageSpeed Insights runs keyless. GitHub checks use raw.githubusercontent.com HEAD requests.

## Tech Stack

- Next.js 15 + React 19 + TypeScript + Tailwind CSS v4
- pnpm workspaces + Turborepo (monorepo)
- `@auditkit/collectors` → `@auditkit/analyzer` → `@auditkit/generator`
- No database — all results are ephemeral in the HTTP response

## Directory

```
apps/web/src/
  app/             Next.js App Router + API route POST /api/audit
  components/      url-input, pillar-card, score-ring, brief-download, audit-dashboard

packages/
  collectors/src/  pagespeed.ts  crux.ts  meta-parser.ts  observatory.ts  github.ts
  scorer/src/      scorePerformance  scoreSEO  scoreAccessibility  scoreSecurity  scoreStructuredData  scoreAIReadiness
  analyzer/src/    runAudit({ url, type }) → AuditResult
  generator/src/   generateBriefZip(result) → Blob (ZIP)
```

## Commands

```bash
bun run dev          # start dev server on :3000
bun run build        # build all packages via Turborepo
bun run type-check   # TypeScript across all packages
```

## Patterns

- All collectors return `Promise<CollectorResult<T>>` — never throw, always return `{ status: 'error' | 'skipped' | 'ok', ... }`
- Scores: `Math.max(0, Math.min(100, score))` — always 0–100
- Issues: `severity: 'critical' | 'warning' | 'info'` — critical deducts ≥15 pts
- Prefer `interfaces` over `types` for object shapes
- Use `AbortSignal.timeout(ms)` on every external fetch

## Do NOT

- Add authentication or a database (Phase 1 is stateless)
- Change the ZIP structure in `packages/generator/src/index.ts` without updating README
- Add Google/GitHub API keys — the whole point is zero keys required
- Run `pnpm test` without a file path pattern (runs all tests)

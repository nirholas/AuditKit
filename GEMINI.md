# GEMINI.md — AuditKit

Guidelines for Gemini and Google AI agents in this repository.

## What is AuditKit?

AuditKit is an open-source, zero-API-key website auditor. Paste a URL → get a full audit across 6 pillars → download a ZIP of AI agent files that are pre-written to fix every detected issue.

**Live pillars**: Performance · SEO · Accessibility · Security · Structured Data · AI Readiness

## No API Keys Required

| Data Source | How |
|---|---|
| Performance / LCP / CLS / FID | PageSpeed Insights (keyless) |
| Real-user field data (CrUX) | Extracted from PSI `loadingExperience` block |
| Security headers | Direct `HEAD` fetch |
| Meta / OG / Schema.org | Direct HTML parse |
| `robots.txt` / `llms.txt` | Direct fetch |
| GitHub file checks | `raw.githubusercontent.com` HEAD requests |
| GitHub repo metadata | Unauthenticated `api.github.com` (60 req/hr) |

## Repository Layout

```
apps/
  web/              Next.js 15 frontend + API route
packages/
  collectors/       Data collection (pagespeed, crux, meta-parser, observatory, github)
  scorer/           Scoring functions per pillar
  analyzer/         Orchestrator — runs all collectors, returns AuditResult
  generator/        ZIP generator with AGENTS.md, CLAUDE.md, GEMINI.md, skill files
```

## Key Types (packages/collectors/src/types.ts)

```ts
interface PillarScore {
  id: PillarId
  score: number        // 0–100
  grade: string        // A+, A, B...
  issues: AuditIssue[]
}

interface AuditIssue {
  severity: 'critical' | 'warning' | 'info'
  message: string
  fix?: string         // plain-English fix description
}
```

## Running Locally

```bash
git clone https://github.com/nirholas/AuditKit
cd AuditKit
pnpm install
bun run dev   # → http://localhost:3000
```

## Extending

To add a new check: create `packages/collectors/src/{name}.ts`, export `collect{Name}(): Promise<CollectorResult<T>>`, add scorer in `packages/scorer/src/index.ts`, wire into `packages/analyzer/src/index.ts`.

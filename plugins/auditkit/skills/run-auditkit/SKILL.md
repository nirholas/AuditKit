---
name: run-auditkit
description: Run AuditKit locally and audit a website or GitHub repo through its POST /api/audit endpoint, reading per-pillar scores and issues. Use when the user wants a scored audit of a URL for SEO, performance, security, accessibility, structured data or AI readiness.
---

# Run AuditKit

AuditKit (`nirholas/AuditKit`) is a pnpm and Turborepo monorepo: a Next.js app in `apps/web` and the packages `@auditkit/collectors`, `scorer`, `analyzer` and `generator`. The packages are private, so the app runs from a clone. Node 20 or newer and pnpm 9 are required.

## Start it

```bash
git clone https://github.com/nirholas/AuditKit.git
cd AuditKit
pnpm install
cp .env.example .env
pnpm dev                 # turbo run dev, Next.js on http://localhost:3000
```

No API key is required. Optional keys in `.env`:

- `GOOGLE_API_KEY`: higher PageSpeed Insights quota.
- `GITHUB_TOKEN`: raises the GitHub API limit from 60 to 5,000 requests per hour, which matters for repo audits.
- `GROQ_API_KEY`: enables `POST /api/insights`, the AI summary panel. Without it that route returns 503.

## Audit a URL or repo

```bash
curl -s -X POST http://localhost:3000/api/audit \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com", "type": "url"}'
```

`type` is `url` or `github` (for `github`, pass the repository URL). A bad URL returns HTTP 400. The request can take up to 60 seconds.

The response is an audit result:

- `pillars[]`: each has `id` (`performance`, `seo`, `accessibility`, `security`, `structured-data`, `ai-readiness`, `repo-health`), `label`, `score` (0 to 100) and `issues[]`.
- Each issue has `id`, `title`, `description`, `severity` (`critical`, `warning` or `info`), `fix` and `pillar`.
- `briefPreview`: `agentsMd`, `claudeMd`, `geminiMd` and `skills`, a map from pillar id to generated fix-skill text for pillars that have issues.

Summarise with jq, for example the critical issues:

```bash
... | jq '[.pillars[] | {pillar: .id, score, critical: [.issues[] | select(.severity == "critical") | .title]}]'
```

## Notes

- The accessibility pillar is documented as not fully implemented yet (axe-core collection is planned), so a missing accessibility score is not a site problem.
- Report scores and issues exactly as returned; do not estimate scores the tool did not produce.
- To apply the fixes, use the `fix-audit-findings` skill.

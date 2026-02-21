# AuditKit

**Full-stack website & GitHub repo auditor.** Paste a URL or GitHub repo → get scores for performance, SEO, accessibility, security, structured data, and AI readiness → download a ready-to-run AI agent brief (AGENTS.md, CLAUDE.md, GEMINI.md, skill files) that fixes every detected issue.

## What it checks

| Pillar | Sources |
|---|---|
| Performance | Google PageSpeed Insights, Chrome UX Report (real users) |
| SEO | Meta tags, canonical, OG/Twitter, robots.txt, sitemap, TTFB |
| Accessibility | axe-core (WCAG 2.1 A/AA/AAA) — Phase 2 |
| Security | Mozilla Observatory, direct header check, SSL/TLS |
| Structured Data | JSON-LD detection, schema.org type validation |
| AI Readiness | llms.txt, AGENTS.md, robots.txt AI clauses, OG completeness |
| Repo Health | README, LICENSE, CI/CD, Dependabot, CONTRIBUTING, SECURITY |

## The killer feature

After auditing, AuditKit generates a downloadable ZIP:

```
auditkit-brief-yoursite.com/
├── AGENTS.md              ← master brief with all issues + fix instructions
├── CLAUDE.md              ← Claude Code-specific instructions
├── GEMINI.md              ← Gemini-specific instructions
├── llms.txt               ← template to add to your site
├── .agents/skills/
│   ├── performance/SKILL.md
│   ├── seo/SKILL.md
│   ├── security/SKILL.md
│   └── ...                ← one per affected pillar
├── checklists/            ← per-pillar fix checklists
└── ready-to-deploy/
    ├── robots.txt         ← generated, ready to commit
    ├── security-headers.next.js
    └── structured-data.jsonld
```

No other tool generates fix-ready agent briefs. This is the gap AuditKit fills.

## Tech stack

- **Framework**: Next.js 15, TypeScript, React 19
- **UI**: Tailwind CSS v4, shadcn/ui principles
- **Monorepo**: pnpm workspaces + Turborepo
- **Packages**: `@auditkit/collectors`, `@auditkit/scorer`, `@auditkit/analyzer`, `@auditkit/generator`
- **Infra**: Google Cloud Run + Cloud Tasks (long-running Playwright collectors)

## Getting started

```bash
# Clone
git clone https://github.com/nirholas/AuditKit
cd AuditKit

# Install
pnpm install

# Configure
cp .env.example .env
# Add GOOGLE_API_KEY for PageSpeed + CrUX
# Add GITHUB_TOKEN for higher GitHub API rate limits (optional)

# Run
pnpm dev
# → http://localhost:3000
```

## Project structure

```
auditkit/
├── apps/web/              ← Next.js 15 frontend + API routes
├── packages/
│   ├── collectors/        ← one file per data source (pagespeed, crux, github, etc.)
│   ├── scorer/            ← converts raw data → pillar scores + issues
│   ├── analyzer/          ← orchestrates collectors in parallel
│   └── generator/         ← converts scores → AI agent brief ZIP
```

## APIs used

| API | Free? | Requires Key? |
|---|---|---|
| Google PageSpeed Insights | ✅ | Optional (quota) |
| Chrome UX Report (CrUX) | ✅ | Required |
| Mozilla Observatory | ✅ | No |
| GitHub REST API | ✅ | Optional (rate limits) |
| W3C Nu Validator | ✅ | No |
| Website Carbon API | ✅ | No |

## Roadmap

- [ ] Phase 1: URL audit (PageSpeed, CrUX, meta, security) ✅
- [ ] Phase 2: axe-core accessibility via Playwright
- [ ] Phase 3: GitHub repo scanning ✅
- [ ] Phase 4: AI brief generator ✅
- [ ] Phase 5: GCP Cloud Run workers for long-running collectors
- [ ] Phase 6: Side-by-side comparison, share links, diff re-runs

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome.

## License

MIT

# AuditKit

<!-- three.ws:badges -->
[![GitHub stars](https://img.shields.io/github/stars/nirholas/AuditKit?style=flat&logo=github)](https://github.com/nirholas/AuditKit/stargazers) [![Last commit](https://img.shields.io/github/last-commit/nirholas/AuditKit?style=flat)](https://github.com/nirholas/AuditKit/commits) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat)](https://github.com/nirholas/AuditKit/pulls) [![AI agent friendly](https://img.shields.io/badge/AI%20agents-AGENTS.md%20%2B%20llms.txt-6d5dfc?style=flat)](https://github.com/nirholas/AuditKit/blob/HEAD/AGENTS.md)
<!-- /three.ws:badges -->


**Full-stack website & GitHub repo auditor.** Paste a URL or GitHub repo → get scores for performance, SEO, accessibility, security, structured data, and AI readiness → download a ready-to-run AI agent brief (AGENTS.md, CLAUDE.md, GEMINI.md, skill files) that fixes every detected issue.

## What it checks

| Pillar | Sources |
|---|---|
| Performance | Google PageSpeed Insights, Chrome UX Report (real users) |
| SEO | Meta tags, canonical, OG/Twitter, robots.txt, sitemap, TTFB |
| Accessibility | axe-core (WCAG 2.1 A/AA/AAA), not yet implemented (Phase 2) |
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
# Every key is optional. AuditKit runs with none of them.
# GOOGLE_API_KEY  raises the PageSpeed Insights quota
# GITHUB_TOKEN    raises the GitHub API rate limit (60/hr -> 5,000/hr)
# GROQ_API_KEY    enables the AI Insights panel shown after each audit

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

| API | Free? | Requires Key? | Used by |
|---|---|---|---|
| Google PageSpeed Insights | ✅ | Optional (quota) | `packages/collectors/src/pagespeed.ts` |
| Chrome UX Report (CrUX) | ✅ | No, field data is read from the PageSpeed response | `packages/collectors/src/crux.ts` |
| Mozilla HTTP Observatory | ✅ | No | `packages/collectors/src/observatory.ts` |
| GitHub REST API | ✅ | Optional (rate limits) | `packages/collectors/src/github.ts` |
| Groq (`llama-3.3-70b-versatile`) | ✅ | Yes, for the AI Insights panel only | `apps/web/src/app/api/insights/route.ts` |

## Roadmap

- [x] Phase 1: URL audit (PageSpeed, CrUX, meta, security)
- [ ] Phase 2: axe-core accessibility via Playwright
- [x] Phase 3: GitHub repo scanning
- [x] Phase 4: AI brief generator
- [ ] Phase 5: GCP Cloud Run workers for long-running collectors
- [ ] Phase 6: Side-by-side comparison, share links, diff re-runs

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome.

## License

All rights reserved. See [LICENSE](LICENSE).

## Documentation

Full documentation site: **https://nirholas.github.io/AuditKit/**

- [Getting started](docs/getting-started.md) covers install and first run.
- [Examples](docs/examples.md) has copy-paste snippets.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=nirholas/AuditKit&type=Date)](https://www.star-history.com/#nirholas/AuditKit&Date)

<!-- three.ws:growth -->
## Support the project

If AuditKit saves you time, **[star it on GitHub](https://github.com/nirholas/AuditKit)**. Stars are how other developers and AI agents find the repositories worth trusting, and they cost you one click.

Know someone who would use it? [Post on X](https://twitter.com/intent/tweet?text=AuditKit%3A%20Website%20and%20GitHub%20repo%20auditor%20that%20scores%20performance%2C%20SEO%2C%20accessibility%2C%20security%20and%20AI&url=https%3A%2F%2Fgithub.com%2Fnirholas%2FAuditKit) · [Share on Bluesky](https://bsky.app/intent/compose?text=AuditKit%3A%20Website%20and%20GitHub%20repo%20auditor%20that%20scores%20performance%2C%20SEO%2C%20accessibility%2C%20security%20and%20AI%20https%3A%2F%2Fgithub.com%2Fnirholas%2FAuditKit) · [Share on LinkedIn](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Fnirholas%2FAuditKit) · [Submit to Hacker News](https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fgithub.com%2Fnirholas%2FAuditKit&t=AuditKit%3A%20Website%20and%20GitHub%20repo%20auditor%20that%20scores%20performance%2C%20SEO%2C%20accessibility%2C%20security%20and%20AI) · [Share on Reddit](https://www.reddit.com/submit?url=https%3A%2F%2Fgithub.com%2Fnirholas%2FAuditKit&title=AuditKit%3A%20Website%20and%20GitHub%20repo%20auditor%20that%20scores%20performance%2C%20SEO%2C%20accessibility%2C%20security%20and%20AI)

## Built for AI agents too

Coding agents and LLM tooling can read this repo directly: [AGENTS.md](./AGENTS.md), [llms.txt](./llms.txt), [llms-full.txt](./llms-full.txt). Point an agent at `https://github.com/nirholas/AuditKit` and it has the context it needs.

## More from the same author

- [All repositories by nirholas](https://github.com/nirholas/nirholas#readme): the full catalog, grouped by topic
- [three.ws](https://three.ws): the platform for 3D AI agents with Solana wallets, a skill marketplace and x402 payments
- Questions or ideas: [open an issue](https://github.com/nirholas/AuditKit/issues) or [start a discussion](https://github.com/nirholas/AuditKit/discussions)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=nirholas/AuditKit)](https://github.com/nirholas/AuditKit/graphs/contributors)

<!-- /three.ws:growth -->

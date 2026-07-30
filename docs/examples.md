# AuditKit examples

Full-stack website and GitHub repo auditor: scores performance, SEO, accessibility, security, structured data and AI readiness, then generates a ready-to-run AI agent fix brief.

## Example 1

```text
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

## Example 2

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

## Example 3

```text
auditkit/
├── apps/web/              ← Next.js 15 frontend + API routes
├── packages/
│   ├── collectors/        ← one file per data source (pagespeed, crux, github, etc.)
│   ├── scorer/            ← converts raw data → pillar scores + issues
│   ├── analyzer/          ← orchestrates collectors in parallel
│   └── generator/         ← converts scores → AI agent brief ZIP
```


Every snippet above is taken from the [repository documentation](https://github.com/nirholas/AuditKit#readme).

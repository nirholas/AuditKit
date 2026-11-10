---
name: fix-audit-findings
description: Fix the issues an AuditKit audit reports, pillar by pillar (SEO, performance, security headers, accessibility, structured data, AI readiness). Use after an audit, or when the user asks to improve a site's SEO, Core Web Vitals, headers or llms.txt.
---

# Fix AuditKit findings

Work from the audit's `issues[]`: each carries a `fix` string. Start with `severity: critical`, then `warning`. Re-run the audit afterwards (see `run-auditkit`) and compare scores.

## SEO (`seo`)

- Every page needs a `<title>` of 50 to 60 characters, a `<meta name="description">` of 120 to 158 characters, `<link rel="canonical">`, one `<h1>` and `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Add Open Graph tags (`og:title`, `og:description`, `og:image` at 1200x630, `og:url`, `og:type`) and Twitter card tags.
- Serve `/robots.txt` with a `Sitemap:` line and a valid `/sitemap.xml`.
- In Next.js, use the Metadata API (`export const metadata`) instead of hand-written head tags.

## Performance (`performance`)

Targets: LCP under 2.5 s, CLS under 0.1, TBT under 200 ms, FCP under 1.8 s, TTFB under 800 ms.

- Slow LCP: preload and size the hero image, serve modern formats, avoid lazy-loading above the fold.
- High CLS: set width and height (or aspect-ratio) on images, embeds and ad slots; reserve space for late content.
- Render-blocking resources: defer scripts, inline critical CSS, preload fonts with `font-display: swap`.
- High TTFB: cache at the CDN, reduce server work on first byte.

## Security (`security`)

Send these headers on every response: `Strict-Transport-Security` (`max-age=63072000; includeSubDomains; preload`), `Content-Security-Policy`, `X-Frame-Options` (or `frame-ancestors`), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. Configure them in `next.config.ts` `headers()` or the host's config. Start the CSP permissive, then tighten after checking the browser console. Serve over HTTPS only, hide server version headers, run `npm audit` or `pnpm audit`, and publish `/.well-known/security.txt`.

## Accessibility (`accessibility`)

Alt text on every meaningful image (empty `alt=""` for decorative ones), WCAG AA contrast (4.5:1 for body text), labelled form controls, visible focus styles, full keyboard operation, correct landmarks and ARIA only where native elements fall short.

## Structured data (`structured-data`)

Add JSON-LD for the page type (`SoftwareApplication`, `Article`, `Organization`, `FAQPage`), valid against schema.org. In Next.js render it with a `<script type="application/ld+json">` tag. Validate with Google's Rich Results Test.

## AI readiness (`ai-readiness`) and repo health (`repo-health`)

- Publish `/llms.txt` (and optionally `/llms-full.txt`) describing the site for language models.
- Add `AGENTS.md` (project, stack, directory map, commands, conventions); `CLAUDE.md` and `GEMINI.md` can point to it.
- In `robots.txt`, decide explicitly about AI crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`); allow them if discovery is the goal.
- Repo health: README, LICENSE, CI, Dependabot, CONTRIBUTING and SECURITY files.

The brief ZIP downloaded from the web UI also contains a `ready-to-deploy/` folder (`robots.txt`, a Next.js security-headers config, JSON-LD); reuse those files instead of rewriting them.

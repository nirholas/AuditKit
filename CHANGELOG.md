# Changelog

All notable changes to AuditKit are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). AuditKit uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Initial monorepo scaffold (pnpm workspaces + Turborepo)
- `@auditkit/collectors` — PageSpeed, CrUX, meta-parser, security headers, GitHub
- `@auditkit/scorer` — 6-pillar scoring: Performance, SEO, Accessibility, Security, Structured Data, AI Readiness
- `@auditkit/analyzer` — orchestrates all collectors, returns unified `AuditResult`
- `@auditkit/generator` — ZIP generator with AGENTS.md, CLAUDE.md, GEMINI.md, per-pillar skill files, checklists, deploy configs
- Aurora gradient UI (dark background + soft blue bokeh orbs + glass morphism cards)
- Zero API keys required — PageSpeed Insights runs keyless, GitHub checks use raw.githubusercontent.com
- Score ring SVGs with animated progress and glow effect
- Downloadable AI brief ZIP with pre-written fix instructions

---

## [0.1.0] — 2026-02-21

Initial release.

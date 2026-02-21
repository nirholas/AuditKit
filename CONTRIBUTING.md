# Contributing to AuditKit

Thank you for your interest in contributing! AuditKit is a zero-key website auditor and we welcome contributions of all kinds.

## Getting Started

```bash
git clone https://github.com/nirholas/AuditKit
cd AuditKit
pnpm install
bun run dev
```

## What to Work On

Check the [open issues](https://github.com/nirholas/AuditKit/issues) — especially ones labelled `good first issue`.

High-value areas:
- **New collectors** — lighthouse local runner, W3C validator, carbon footprint (websitecarbon.com)
- **Scoring improvements** — better weighting, more granular issue detection
- **UI polish** — the aurora gradient design system
- **Generator templates** — better AGENTS.md / CLAUDE.md output quality
- **Docs** — usage guides, self-hosting, API docs

## Submitting a PR

1. Fork and create a branch: `feat/your-feature` or `fix/bug-name`
2. Make your changes — keep PRs focused (one feature or fix per PR)
3. Run type-check: `bun run type-check`
4. Open a PR with a clear title and description

## Adding a New Collector

1. Create `packages/collectors/src/{name}.ts`
2. Export `async function collect{Name}(url: string): Promise<CollectorResult<YourDataType>>`
3. Add your `YourDataType` interface to `packages/collectors/src/types.ts`
4. Export from `packages/collectors/src/index.ts`
5. Add a scorer function in `packages/scorer/src/index.ts`
6. Wire into `packages/analyzer/src/index.ts`

## Code Style

- TypeScript strict mode — no `any`
- Prefer `interface` over `type` for object shapes
- All collector functions must return `CollectorResult<T>` — never throw
- Scores are always 0–100, clamped: `Math.max(0, Math.min(100, score))`

## Commit Messages

Use conventional commits with an emoji prefix:
- `✨ feat: add carbon footprint collector`
- `🐛 fix: handle PSI timeout gracefully`
- `📝 docs: update llms-full.txt`
- `♻️ refactor: simplify scorer weighting`

## Design Principles

AuditKit is intentionally zero-key. Before adding any API that requires a token or paid plan, check whether the same data can be obtained with a direct fetch or public API.

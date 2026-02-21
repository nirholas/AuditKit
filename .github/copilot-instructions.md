# GitHub Copilot Instructions — AuditKit

## Project

AuditKit is a zero-API-key website auditor (Next.js 15, TypeScript, pnpm monorepo). It scores sites across 6 pillars and generates AI agent ZIPs to fix detected issues.

## Tech Stack

- **Frontend**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4
- **Monorepo**: pnpm workspaces + Turborepo
- **Packages**: `@auditkit/collectors` → `@auditkit/analyzer` → `@auditkit/generator`

## Key Patterns

### Collector pattern (always use this shape)
```typescript
export async function collectSomething(url: string): Promise<CollectorResult<SomeData>> {
  const start = Date.now()
  try {
    // ... do work
    return { status: 'ok', data, durationMs: Date.now() - start }
  } catch (err) {
    return { status: 'error', error: err instanceof Error ? err.message : 'Failed', durationMs: Date.now() - start }
  }
}
```

### Scoring pattern
```typescript
export function scoreSomething(data: SomeData): PillarScore {
  let score = 100
  const issues: AuditIssue[] = []
  // deduct points and push issues
  score = Math.max(0, Math.min(100, score))
  return { id: 'some-pillar', label: 'Some Pillar', score, grade: gradeFromScore(score), issues }
}
```

## Rules

1. **Never throw** in a collector — always return `CollectorResult`
2. **No API keys** — if a check needs a key, find a keyless alternative
3. **Always add `AbortSignal.timeout(ms)`** to every `fetch()`
4. Scores are always 0–100 — clamp with `Math.max(0, Math.min(100, n))`
5. Prefer `interface` over `type` for object shapes
6. `critical` severity issues deduct ≥15 points

## Do Not

- Add a database or auth in Phase 1
- Change the ZIP file structure without updating README
- Use `any` — everything must be typed

import {
    collectPageSpeed,
    collectCrUX,
    collectMeta,
    collectSecurity,
    collectGitHub,
} from '@auditkit/collectors'
import type { AuditResult, PillarScore } from '@auditkit/collectors'
import {
    scorePerformance,
    scoreSEO,
    scoreAccessibility,
    scoreSecurity,
    scoreStructuredData,
    scoreAIReadiness,
    scoreRepoHealth,
} from '@auditkit/scorer'

export type { AuditResult, PillarScore } from '@auditkit/collectors'

interface RunAuditOptions {
    url: string
    type: 'url' | 'github'
}

export async function runAudit({ url, type }: RunAuditOptions): Promise<AuditResult> {
    const auditedAt = new Date().toISOString()

    if (type === 'github') {
        // GitHub repo audit
        const [github] = await Promise.all([collectGitHub(url)])

        const pillars: PillarScore[] = [
            scoreRepoHealth(github),
            scoreAIReadiness(undefined, github),
        ].filter((p) => p.score > 0 || p.issues.length > 0)

        return {
            url,
            type: 'github',
            auditedAt,
            pillars,
            raw: { github },
        }
    }

    // URL audit — run all collectors in parallel
    const [pagespeed, crux, meta, security] = await Promise.all([
        collectPageSpeed(url),
        collectCrUX(url),
        collectMeta(url),
        collectSecurity(url),
        // Future: collectAccessibility(url), collectW3C(url), collectCarbon(url)
    ])

    const pillars: PillarScore[] = [
        scorePerformance(pagespeed, crux),
        scoreSEO(meta),
        scoreAccessibility(undefined), // axe requires browser — Phase 2
        scoreSecurity(security),
        scoreStructuredData(meta),
        scoreAIReadiness(meta),
    ]

    return {
        url,
        type: 'url',
        auditedAt,
        pillars,
        meta: meta.data,
        raw: {
            pagespeed,
            crux,
            security,
        },
    }
}

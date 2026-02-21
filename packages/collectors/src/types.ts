// ─── Core issue shape ────────────────────────────────────────────────────────

export interface AuditIssue {
    id: string
    title: string
    description: string
    severity: 'critical' | 'warning' | 'info'
    /** One-line fix instruction for the AI brief */
    fix?: string
    /** Code snippet or config example */
    snippet?: string
    /** Link to relevant documentation */
    docs?: string
    /** Which pillar this belongs to */
    pillar: PillarId
}

// ─── Pillars ─────────────────────────────────────────────────────────────────

export type PillarId =
    | 'performance'
    | 'seo'
    | 'accessibility'
    | 'security'
    | 'structured-data'
    | 'ai-readiness'
    | 'repo-health'

export interface PillarScore {
    id: PillarId
    label: string
    score: number           // 0–100
    issues: AuditIssue[]
}

// ─── Collector raw outputs ────────────────────────────────────────────────────

export interface PageSpeedData {
    performanceScore: number
    fcp: number   // ms
    lcp: number   // ms
    cls: number
    tbt: number   // ms
    ttfb: number  // ms
    speedIndex: number
    opportunities: Array<{ title: string; savings: number }>
    diagnostics: Array<{ title: string; description: string }>
}

export interface CrUXData {
    lcp: { p75: number; rating: 'good' | 'needs-improvement' | 'poor' }
    cls: { p75: number; rating: 'good' | 'needs-improvement' | 'poor' }
    inp: { p75: number; rating: 'good' | 'needs-improvement' | 'poor' }
    fcp: { p75: number; rating: 'good' | 'needs-improvement' | 'poor' }
}

export interface MetaData {
    title?: string
    description?: string
    canonical?: string
    robots?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    twitterCard?: string
    hasViewport?: boolean
    hasHreflang?: boolean
    hasStructuredData?: boolean
    structuredDataTypes?: string[]
    hasSitemap?: boolean
    hasRobotsTxt?: boolean
    hasLlmsTxt?: boolean
    hasAgentsMd?: boolean
    tech?: string[]
    responseTimeMs?: number
    statusCode?: number
}

export interface SecurityData {
    grade?: string          // A+ to F
    headers: {
        csp?: string
        hsts?: string
        xFrameOptions?: string
        xContentTypeOptions?: string
        referrerPolicy?: string
        permissionsPolicy?: string
    }
    missing: string[]
    sslValid?: boolean
    sslExpiry?: string
    sslGrade?: string
}

export interface AccessibilityData {
    violations: Array<{
        id: string
        impact: 'critical' | 'serious' | 'moderate' | 'minor'
        description: string
        nodes: number
        helpUrl: string
    }>
    wcagLevel: string
}

export interface GitHubData {
    owner: string
    repo: string
    description?: string
    stars: number
    forks: number
    openIssues: number
    license?: string
    defaultBranch: string
    hasReadme: boolean
    hasLicense: boolean
    hasContributing: boolean
    hasCodeOfConduct: boolean
    hasSecurity: boolean
    hasCodeowners: boolean
    hasAgentsMd: boolean
    hasClaude: boolean
    hasGemini: boolean
    hasCopilotInstructions: boolean
    hasLlmsTxt: boolean
    hasGithubWorkflows: boolean
    hasDependabot: boolean
    hasBranchProtection: boolean
    hasIssueTemplates: boolean
    hasPrTemplate: boolean
    topicsCount: number
    latestRelease?: string
    daysSinceLastCommit: number
}

// ─── Collector result wrapper ─────────────────────────────────────────────────

export type CollectorStatus = 'ok' | 'error' | 'skipped'

export interface CollectorResult<T> {
    status: CollectorStatus
    data?: T
    error?: string
    durationMs: number
}

// ─── Brief preview (file contents rendered before download) ─────────────────

export interface BriefPreview {
    agentsMd: string
    claudeMd: string
    geminiMd: string
    skills: Record<string, string>  // pillarId → SKILL.md content
}

// ─── Full audit result ────────────────────────────────────────────────────────

export interface AuditResult {
    url: string
    type: 'url' | 'github'
    auditedAt: string   // ISO timestamp
    pillars: PillarScore[]
    meta?: MetaData
    briefPreview?: BriefPreview
    raw?: {
        pagespeed?: CollectorResult<PageSpeedData>
        crux?: CollectorResult<CrUXData>
        security?: CollectorResult<SecurityData>
        accessibility?: CollectorResult<AccessibilityData>
        github?: CollectorResult<GitHubData>
    }
}

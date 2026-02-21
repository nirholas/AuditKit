import type {
    AuditIssue,
    PillarScore,
    PageSpeedData,
    CrUXData,
    MetaData,
    SecurityData,
    AccessibilityData,
    GitHubData,
    CollectorResult,
} from '@auditkit/collectors'

// ─── Performance ─────────────────────────────────────────────────────────────

export function scorePerformance(
    pagespeed: CollectorResult<PageSpeedData> | undefined,
    crux: CollectorResult<CrUXData> | undefined,
): PillarScore {
    const issues: AuditIssue[] = []
    let score = 100

    if (!pagespeed?.data) {
        return { id: 'performance', label: 'Performance', score: 0, issues }
    }

    const ps = pagespeed.data
    score = ps.performanceScore

    // LCP
    if (ps.lcp > 4000) {
        issues.push({
            id: 'lcp-poor',
            title: 'Largest Contentful Paint is too slow',
            description: `LCP is ${(ps.lcp / 1000).toFixed(1)}s (target: < 2.5s). This is a Core Web Vital.`,
            severity: 'critical',
            fix: 'Preload the hero image, serve it from a CDN, and use modern formats (WebP/AVIF).',
            pillar: 'performance',
        })
        score -= 20
    } else if (ps.lcp > 2500) {
        issues.push({
            id: 'lcp-needs-improvement',
            title: 'LCP needs improvement',
            description: `LCP is ${(ps.lcp / 1000).toFixed(1)}s (target: < 2.5s).`,
            severity: 'warning',
            fix: 'Add `<link rel="preload">` for the LCP image and enable CDN caching.',
            pillar: 'performance',
        })
        score -= 10
    }

    // CLS
    if (ps.cls > 0.25) {
        issues.push({
            id: 'cls-poor',
            title: 'Cumulative Layout Shift is too high',
            description: `CLS is ${ps.cls.toFixed(3)} (target: < 0.1). Users see unexpected layout jumps.`,
            severity: 'critical',
            fix: 'Set explicit width/height on images and embeds. Reserve space for ads/dynamic content.',
            pillar: 'performance',
        })
        score -= 15
    } else if (ps.cls > 0.1) {
        issues.push({
            id: 'cls-warning',
            title: 'CLS needs improvement',
            description: `CLS is ${ps.cls.toFixed(3)} (target: < 0.1).`,
            severity: 'warning',
            fix: 'Set explicit dimensions on all media elements.',
            pillar: 'performance',
        })
        score -= 8
    }

    // TTFB
    if (ps.ttfb > 800) {
        issues.push({
            id: 'ttfb-slow',
            title: 'Slow server response time (TTFB)',
            description: `TTFB is ${ps.ttfb.toFixed(0)}ms (target: < 200ms).`,
            severity: ps.ttfb > 1800 ? 'critical' : 'warning',
            fix: 'Enable server-side caching, use a CDN, or upgrade hosting tier.',
            pillar: 'performance',
        })
        score -= 10
    }

    // TBT
    if (ps.tbt > 600) {
        issues.push({
            id: 'tbt-high',
            title: 'High Total Blocking Time',
            description: `TBT is ${ps.tbt.toFixed(0)}ms (target: < 200ms). JavaScript is blocking the main thread.`,
            severity: 'critical',
            fix: 'Split large JS bundles, defer non-critical scripts, and remove unused code.',
            pillar: 'performance',
        })
        score -= 15
    }

    // Top opportunities
    for (const opp of ps.opportunities.slice(0, 3)) {
        issues.push({
            id: `opp-${opp.title.toLowerCase().replace(/\s+/g, '-')}`,
            title: opp.title,
            description: `Potential saving: ${(opp.savings / 1000).toFixed(1)}s`,
            severity: opp.savings > 1000 ? 'warning' : 'info',
            pillar: 'performance',
        })
    }

    // CrUX real-user data
    if (crux?.data) {
        const c = crux.data
        if (c.inp.rating === 'poor') {
            issues.push({
                id: 'inp-poor',
                title: 'Poor Interaction to Next Paint (real users)',
                description: `Real-user INP p75: ${c.inp.p75}ms (target: < 200ms). This affects your Google Search ranking.`,
                severity: 'critical',
                fix: 'Reduce JavaScript execution time on interaction handlers and use `startTransition` for non-urgent updates.',
                pillar: 'performance',
            })
            score -= 15
        }
    }

    return {
        id: 'performance',
        label: 'Performance',
        score: Math.max(0, Math.min(100, score)),
        issues,
    }
}

// ─── SEO ─────────────────────────────────────────────────────────────────────

export function scoreSEO(meta: CollectorResult<MetaData> | undefined): PillarScore {
    const issues: AuditIssue[] = []
    let score = 100

    if (!meta?.data) {
        return { id: 'seo', label: 'SEO', score: 0, issues }
    }

    const m = meta.data

    if (!m.title) {
        issues.push({ id: 'no-title', title: 'Missing <title> tag', description: 'The page has no title tag. This is critical for SEO.', severity: 'critical', fix: 'Add a unique, descriptive <title> tag (50-60 characters).', pillar: 'seo' })
        score -= 25
    } else if (m.title.length > 60) {
        issues.push({ id: 'title-long', title: 'Title tag too long', description: `Title is ${m.title.length} characters (optimal: 50-60). Google truncates it in search results.`, severity: 'warning', fix: 'Shorten the title to 50-60 characters.', pillar: 'seo' })
        score -= 5
    }

    if (!m.description) {
        issues.push({ id: 'no-description', title: 'Missing meta description', description: 'No meta description tag found. Search engines may generate their own, often poorly.', severity: 'warning', fix: 'Add a meta description of 120-160 characters summarising the page.', pillar: 'seo' })
        score -= 15
    }

    if (!m.canonical) {
        issues.push({ id: 'no-canonical', title: 'No canonical URL', description: 'Missing rel="canonical" link. Without it, search engines may index duplicate content.', severity: 'warning', fix: 'Add <link rel="canonical" href="https://yourdomain.com/page"> to each page.', pillar: 'seo' })
        score -= 10
    }

    if (!m.hasViewport) {
        issues.push({ id: 'no-viewport', title: 'No viewport meta tag', description: 'Missing viewport meta tag. The page will not render correctly on mobile.', severity: 'critical', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.', pillar: 'seo' })
        score -= 20
    }

    if (!m.ogTitle) {
        issues.push({ id: 'no-og-title', title: 'Missing Open Graph title', description: 'No og:title tag. Links shared on social media will not preview correctly.', severity: 'warning', fix: 'Add <meta property="og:title" content="..."> to the page head.', pillar: 'seo' })
        score -= 5
    }

    if (!m.ogImage) {
        issues.push({ id: 'no-og-image', title: 'Missing Open Graph image', description: 'No og:image tag. Social shares will have no preview image.', severity: 'warning', fix: 'Add <meta property="og:image" content="https://..."> with a 1200×630 image.', pillar: 'seo' })
        score -= 5
    }

    if (!m.hasSitemap) {
        issues.push({ id: 'no-sitemap', title: 'No sitemap.xml found', description: 'sitemap.xml was not found at /sitemap.xml. Search engines rely on sitemaps to discover content.', severity: 'warning', fix: 'Generate and serve a sitemap.xml. Submit it to Google Search Console and Bing Webmaster Tools.', pillar: 'seo' })
        score -= 10
    }

    if (!m.hasRobotsTxt) {
        issues.push({ id: 'no-robots-txt', title: 'No robots.txt found', description: 'robots.txt was not found. Search engines may crawl unwanted pages.', severity: 'warning', fix: 'Create /robots.txt and include a Sitemap: directive.', pillar: 'seo' })
        score -= 5
    }

    if (m.responseTimeMs && m.responseTimeMs > 3000) {
        issues.push({ id: 'slow-response', title: 'Slow server response', description: `Page responded in ${m.responseTimeMs}ms. Slow pages rank lower.`, severity: 'warning', pillar: 'seo' })
        score -= 5
    }

    return { id: 'seo', label: 'SEO', score: Math.max(0, Math.min(100, score)), issues }
}

// ─── Accessibility ────────────────────────────────────────────────────────────

export function scoreAccessibility(
    data: CollectorResult<AccessibilityData> | undefined,
): PillarScore {
    const issues: AuditIssue[] = []
    let score = 100

    if (!data?.data) {
        return { id: 'accessibility', label: 'Accessibility', score: 0, issues }
    }

    for (const v of data.data.violations) {
        const severity: AuditIssue['severity'] =
            v.impact === 'critical' || v.impact === 'serious' ? 'critical' : 'warning'
        issues.push({
            id: `a11y-${v.id}`,
            title: v.description,
            description: `${v.nodes} element${v.nodes === 1 ? '' : 's'} affected. WCAG violation.`,
            severity,
            docs: v.helpUrl,
            fix: `See axe docs: ${v.helpUrl}`,
            pillar: 'accessibility',
        })
        score -= severity === 'critical' ? 15 : 5
    }

    return {
        id: 'accessibility',
        label: 'Accessibility',
        score: Math.max(0, Math.min(100, score)),
        issues,
    }
}

// ─── Security ────────────────────────────────────────────────────────────────

export function scoreSecurity(
    data: CollectorResult<SecurityData> | undefined,
): PillarScore {
    const issues: AuditIssue[] = []
    let score = 100

    if (!data?.data) {
        return { id: 'security', label: 'Security', score: 0, issues }
    }

    const s = data.data

    if (!s.sslValid) {
        issues.push({ id: 'no-https', title: 'Site not served over HTTPS', description: 'The site is served over HTTP. All traffic is unencrypted.', severity: 'critical', fix: 'Install an SSL certificate and redirect all HTTP traffic to HTTPS.', pillar: 'security' })
        score -= 40
    }

    for (const header of s.missing) {
        const isCritical = header === 'Content-Security-Policy' || header === 'Strict-Transport-Security'
        issues.push({
            id: `missing-${header.toLowerCase().replace(/[^a-z]/g, '-')}`,
            title: `Missing ${header} header`,
            description: `The ${header} security header is not set.`,
            severity: isCritical ? 'critical' : 'warning',
            fix: `Add ${header} to your server response headers.`,
            pillar: 'security',
        })
        score -= isCritical ? 15 : 8
    }

    if (s.grade && s.grade < 'B') {
        issues.push({
            id: 'observatory-low',
            title: `Mozilla Observatory grade: ${s.grade}`,
            description: `Security header score is ${s.grade}. A grade of A or higher is recommended.`,
            severity: s.grade < 'C' ? 'critical' : 'warning',
            pillar: 'security',
        })
    }

    return {
        id: 'security',
        label: 'Security',
        score: Math.max(0, Math.min(100, score)),
        issues,
    }
}

// ─── Structured Data ─────────────────────────────────────────────────────────

export function scoreStructuredData(
    meta: CollectorResult<MetaData> | undefined,
): PillarScore {
    const issues: AuditIssue[] = []
    let score = 100

    if (!meta?.data) {
        return { id: 'structured-data', label: 'Structured Data', score: 0, issues }
    }

    const m = meta.data

    if (!m.hasStructuredData) {
        issues.push({
            id: 'no-schema',
            title: 'No structured data (JSON-LD)',
            description: 'No schema.org structured data found. Search engines cannot generate rich results for this page.',
            severity: 'warning',
            fix: 'Add JSON-LD structured data. For articles, use NewsArticle. For products, use Product. For organisations, use Organization.',
            snippet: '{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "Your Site",\n  "url": "https://yoursite.com"\n}',
            pillar: 'structured-data',
        })
        score -= 40
    } else if (m.structuredDataTypes) {
        const recommended = ['WebSite', 'Organization', 'BreadcrumbList']
        const missing = recommended.filter((t) => !m.structuredDataTypes?.includes(t))
        for (const type of missing) {
            issues.push({
                id: `missing-schema-${type.toLowerCase()}`,
                title: `Missing ${type} schema`,
                description: `${type} structured data is recommended for better search visibility.`,
                severity: 'info',
                fix: `Add a ${type} JSON-LD block to the page head.`,
                pillar: 'structured-data',
            })
            score -= 5
        }
    }

    return {
        id: 'structured-data',
        label: 'Structured Data',
        score: Math.max(0, Math.min(100, score)),
        issues,
    }
}

// ─── AI Readiness ─────────────────────────────────────────────────────────────

export function scoreAIReadiness(
    meta: CollectorResult<MetaData> | undefined,
    github?: CollectorResult<GitHubData>,
): PillarScore {
    const issues: AuditIssue[] = []
    let score = 100

    // Website AI signals
    if (meta?.data) {
        const m = meta.data
        if (!m.hasLlmsTxt) {
            issues.push({
                id: 'no-llms-txt',
                title: 'No /llms.txt found',
                description: 'llms.txt is the emerging standard for helping AI systems understand your site (like robots.txt, but for LLMs).',
                severity: 'warning',
                fix: 'Create /llms.txt following the llms.txt specification at https://llmstxt.org/',
                docs: 'https://llmstxt.org/',
                pillar: 'ai-readiness',
            })
            score -= 20
        }

        if (!m.hasAgentsMd) {
            issues.push({
                id: 'no-agents-md',
                title: 'No /AGENTS.md found',
                description: 'AGENTS.md provides instructions for AI coding agents working on your codebase.',
                severity: 'info',
                fix: 'Create AGENTS.md at the root of your repo with project context, commands, and development guidelines.',
                pillar: 'ai-readiness',
            })
            score -= 10
        }

        if (!m.ogImage) {
            issues.push({
                id: 'ai-no-og-image',
                title: 'Missing og:image hurts AI-generated summaries',
                description: 'AI tools that summarise links use og:image for visual context.',
                severity: 'info',
                pillar: 'ai-readiness',
            })
            score -= 5
        }
    }

    // GitHub AI signals
    if (github?.data) {
        const g = github.data
        if (!g.hasAgentsMd) {
            issues.push({ id: 'no-agents-md-repo', title: 'Missing AGENTS.md in repo', description: 'AI coding agents (Copilot, Claude Code, Cursor) use AGENTS.md for project context.', severity: 'critical', fix: 'Create AGENTS.md at repo root with: project description, tech stack, commands, and development guidelines.', pillar: 'ai-readiness' })
            score -= 25
        }
        if (!g.hasClaude) {
            issues.push({ id: 'no-claude-md', title: 'Missing CLAUDE.md', description: 'CLAUDE.md provides Claude-specific instructions for agentic coding tasks.', severity: 'warning', fix: 'Create CLAUDE.md with testing commands, style guide, and important implementation notes.', pillar: 'ai-readiness' })
            score -= 10
        }
        if (!g.hasGemini) {
            issues.push({ id: 'no-gemini-md', title: 'Missing GEMINI.md', description: 'GEMINI.md provides Gemini-specific agentic context.', severity: 'info', pillar: 'ai-readiness' })
            score -= 5
        }
        if (!g.hasCopilotInstructions) {
            issues.push({ id: 'no-copilot-instructions', title: 'Missing .github/copilot-instructions.md', description: 'GitHub Copilot customisation instructions are not set for your repo.', severity: 'warning', fix: 'Create .github/copilot-instructions.md with your coding standards and project context.', pillar: 'ai-readiness' })
            score -= 10
        }
        if (!g.hasLlmsTxt) {
            issues.push({ id: 'no-llms-txt-repo', title: 'Missing llms.txt context file', description: 'No llms.txt or llms-full.txt found. AI tools have no curated context file.', severity: 'info', pillar: 'ai-readiness' })
            score -= 5
        }
    }

    return {
        id: 'ai-readiness',
        label: 'AI Readiness',
        score: Math.max(0, Math.min(100, score)),
        issues,
    }
}

// ─── Repo Health ─────────────────────────────────────────────────────────────

export function scoreRepoHealth(
    github: CollectorResult<GitHubData> | undefined,
): PillarScore {
    const issues: AuditIssue[] = []
    let score = 100

    if (!github?.data) {
        return { id: 'repo-health', label: 'Repo Health', score: 0, issues }
    }

    const g = github.data

    if (!g.hasReadme) { issues.push({ id: 'no-readme', title: 'Missing README', description: 'No README file found. Contributors and users have no documentation.', severity: 'critical', fix: 'Create README.md with project purpose, setup steps, and usage examples.', pillar: 'repo-health' }); score -= 30 }
    if (!g.hasLicense) { issues.push({ id: 'no-license', title: 'Missing LICENSE file', description: 'No license file found. The project is technically All Rights Reserved.', severity: 'critical', fix: 'Add a LICENSE file. For open source, use MIT, Apache-2.0, or GPL.', pillar: 'repo-health' }); score -= 20 }
    if (!g.hasContributing) { issues.push({ id: 'no-contributing', title: 'Missing CONTRIBUTING.md', description: 'No contribution guide exists. Contributors have no guidance on how to contribute.', severity: 'warning', fix: 'Create CONTRIBUTING.md describing the development process, PR guidelines, and code style.', pillar: 'repo-health' }); score -= 10 }
    if (!g.hasSecurity) { issues.push({ id: 'no-security', title: 'Missing SECURITY.md', description: 'No security policy file. Users cannot report vulnerabilities responsibly.', severity: 'warning', fix: 'Create SECURITY.md describing how to report security vulnerabilities.', pillar: 'repo-health' }); score -= 10 }
    if (!g.hasGithubWorkflows) { issues.push({ id: 'no-ci', title: 'No CI/CD workflows', description: 'No GitHub Actions workflows found. No automated testing or deployment pipeline.', severity: 'warning', fix: 'Add .github/workflows/ci.yml with test, lint, and type-check jobs.', pillar: 'repo-health' }); score -= 15 }
    if (!g.hasDependabot) { issues.push({ id: 'no-dependabot', title: 'Dependabot not configured', description: 'Automated dependency updates are not enabled.', severity: 'info', fix: 'Add .github/dependabot.yml to enable automated dependency PRs.', pillar: 'repo-health' }); score -= 5 }
    if (g.topicsCount === 0) { issues.push({ id: 'no-topics', title: 'No GitHub topics set', description: 'Repository has no topics. Topics improve discoverability in GitHub search.', severity: 'info', fix: 'Add 5-10 relevant topics to the repository settings.', pillar: 'repo-health' }); score -= 5 }
    if (g.daysSinceLastCommit > 365) { issues.push({ id: 'stale-repo', title: 'Repo appears unmaintained', description: `Last commit was ${g.daysSinceLastCommit} days ago.`, severity: 'warning', pillar: 'repo-health' }); score -= 10 }

    return {
        id: 'repo-health',
        label: 'Repo Health',
        score: Math.max(0, Math.min(100, score)),
        issues,
    }
}

import type { CollectorResult, MetaData } from './types.js'

export async function collectMeta(url: string): Promise<CollectorResult<MetaData>> {
    const start = Date.now()
    try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 15_000)

        const res = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent':
                    'AuditKit/1.0 (https://github.com/nirholas/AuditKit; audit-bot)',
                Accept: 'text/html',
            },
            redirect: 'follow',
        })
        clearTimeout(timer)

        const html = await res.text()
        const statusCode = res.status
        const responseTimeMs = Date.now() - start

        // Parse all meta tags
        const getTag = (name: string) => {
            const match =
                html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ??
                html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'))
            return match?.[1]
        }

        const getProp = (property: string) => {
            const match =
                html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')) ??
                html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'))
            return match?.[1]
        }

        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)

        // Detect structured data types
        const structuredDataTypes: string[] = []
        const sdMatches = html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)
        for (const m of sdMatches) {
            if (m[1] && !structuredDataTypes.includes(m[1])) {
                structuredDataTypes.push(m[1])
            }
        }

        // Check for llms.txt and AGENTS.md
        const origin = new URL(url).origin
        const [llmsRes, agentsRes, sitemapRes, robotsRes] = await Promise.allSettled([
            fetch(`${origin}/llms.txt`, { method: 'HEAD', signal: AbortSignal.timeout(5000) }),
            fetch(`${origin}/AGENTS.md`, { method: 'HEAD', signal: AbortSignal.timeout(5000) }),
            fetch(`${origin}/sitemap.xml`, { method: 'HEAD', signal: AbortSignal.timeout(5000) }),
            fetch(`${origin}/robots.txt`, { method: 'HEAD', signal: AbortSignal.timeout(5000) }),
        ])

        const ok = (r: PromiseSettledResult<Response>) =>
            r.status === 'fulfilled' && r.value.ok

        const data: MetaData = {
            title: titleMatch?.[1]?.trim(),
            description: getTag('description'),
            canonical: canonicalMatch?.[1],
            robots: getTag('robots'),
            ogTitle: getProp('og:title'),
            ogDescription: getProp('og:description'),
            ogImage: getProp('og:image'),
            twitterCard: getTag('twitter:card'),
            hasViewport: html.includes('name="viewport"') || html.includes("name='viewport'"),
            hasHreflang: html.includes('hreflang'),
            hasStructuredData: structuredDataTypes.length > 0,
            structuredDataTypes,
            hasSitemap: ok(sitemapRes),
            hasRobotsTxt: ok(robotsRes),
            hasLlmsTxt: ok(llmsRes),
            hasAgentsMd: ok(agentsRes),
            responseTimeMs,
            statusCode,
        }

        return { status: 'ok', data, durationMs: Date.now() - start }
    } catch (err) {
        return {
            status: 'error',
            error: err instanceof Error ? err.message : 'Fetch failed',
            durationMs: Date.now() - start,
        }
    }
}

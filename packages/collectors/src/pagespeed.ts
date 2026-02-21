import type { CollectorResult, PageSpeedData } from './types.js'

// PageSpeed Insights public API — no API key required
// Works free at ~1 req/sec per IP, which is plenty for user-triggered audits
const PSI_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'

export async function collectPageSpeed(
    url: string,
    strategy: 'mobile' | 'desktop' = 'mobile',
): Promise<CollectorResult<PageSpeedData>> {
    const start = Date.now()
    try {
        const params = new URLSearchParams({ url, strategy })

        const res = await fetch(`${PSI_API}?${params}`, {
            signal: AbortSignal.timeout(30_000),
        })

        if (!res.ok) {
            return { status: 'error', error: `PageSpeed API ${res.status}`, durationMs: Date.now() - start }
        }

        const json = await res.json()
        const cats = json.lighthouseResult?.categories
        const audits = json.lighthouseResult?.audits

        const opportunities: PageSpeedData['opportunities'] = []
        const diagnostics: PageSpeedData['diagnostics'] = []

        for (const [key, audit] of Object.entries(audits ?? {})) {
            const a = audit as Record<string, unknown>
            if (a['details'] && (a['details'] as Record<string, unknown>)['type'] === 'opportunity') {
                const savings =
                    typeof (a['details'] as Record<string, unknown>)['overallSavingsMs'] === 'number'
                        ? ((a['details'] as Record<string, unknown>)['overallSavingsMs'] as number)
                        : 0
                if (savings > 200) {
                    opportunities.push({ title: String(a['title'] ?? key), savings })
                }
            }
            if (
                a['scoreDisplayMode'] === 'informative' &&
                a['description'] &&
                a['score'] !== 1
            ) {
                diagnostics.push({
                    title: String(a['title'] ?? key),
                    description: String(a['description']),
                })
            }
        }

        const data: PageSpeedData = {
            performanceScore: Math.round((cats?.performance?.score ?? 0) * 100),
            fcp: audits?.['first-contentful-paint']?.numericValue ?? 0,
            lcp: audits?.['largest-contentful-paint']?.numericValue ?? 0,
            cls: audits?.['cumulative-layout-shift']?.numericValue ?? 0,
            tbt: audits?.['total-blocking-time']?.numericValue ?? 0,
            ttfb: audits?.['server-response-time']?.numericValue ?? 0,
            speedIndex: audits?.['speed-index']?.numericValue ?? 0,
            opportunities: opportunities.sort((a, b) => b.savings - a.savings).slice(0, 5),
            diagnostics: diagnostics.slice(0, 5),
        }

        return { status: 'ok', data, durationMs: Date.now() - start }
    } catch (err) {
        return {
            status: 'error',
            error: err instanceof Error ? err.message : 'PSI collection failed',
            durationMs: Date.now() - start,
        }
    }
}

/**
 * Parse the `loadingExperience` block from a PSI response into CrUX-shaped data.
 * This is real-user field data embedded in the same API response — no separate key needed.
 */
export function parseCrUXFromPSI(json: Record<string, unknown>) {
    const exp = json['loadingExperience'] as Record<string, unknown> | undefined
    if (!exp || exp['overall_category'] === undefined) return null

    const metrics = exp['metrics'] as Record<string, Record<string, unknown>> | undefined

    function parse(key: string) {
        const m = metrics?.[key]
        if (!m) return undefined
        const hist = m['histogram'] as Array<{ start: number; density: number }> | undefined
        const p75 = (m['percentile_75'] ?? (m['percentiles'] as Record<string, unknown>)?.[75]) as number | undefined
        const good = hist?.[0]?.density ?? 0
        const needs = hist?.[1]?.density ?? 0
        const rating = good >= 0.75 ? 'good' : needs >= 0.5 ? 'needs-improvement' : 'poor'
        return { p75: p75 ?? 0, rating } as const
    }

    return {
        lcp: parse('LARGEST_CONTENTFUL_PAINT_MS') ?? { p75: 0, rating: 'poor' as const },
        cls: parse('CUMULATIVE_LAYOUT_SHIFT_SCORE') ?? { p75: 0, rating: 'poor' as const },
        inp: parse('INTERACTION_TO_NEXT_PAINT') ?? { p75: 0, rating: 'poor' as const },
        fcp: parse('FIRST_CONTENTFUL_PAINT_MS') ?? { p75: 0, rating: 'poor' as const },
    }
}

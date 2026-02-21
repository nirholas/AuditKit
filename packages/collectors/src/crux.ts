import type { CollectorResult, CrUXData } from './types.js'
import { parseCrUXFromPSI } from './pagespeed.js'

/**
 * Collect real-user (field) data by extracting the `loadingExperience` block
 * that PageSpeed Insights embeds in every response — no API key required.
 */
export async function collectCrUX(url: string): Promise<CollectorResult<CrUXData>> {
    const start = Date.now()
    try {
        // Re-use the keyless PSI call; the response already contains CrUX field data
        const PSI_API = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
        const params = new URLSearchParams({ url, strategy: 'mobile' })
        const res = await fetch(`${PSI_API}?${params}`, { signal: AbortSignal.timeout(30_000) })

        if (!res.ok) {
            return { status: 'skipped', error: `PSI: ${res.status}`, durationMs: Date.now() - start }
        }

        const json = await res.json()
        const crux = parseCrUXFromPSI(json)

        if (!crux) {
            // Origin has insufficient traffic data — common for small/new sites
            return { status: 'skipped', error: 'Insufficient real-user data for this origin', durationMs: Date.now() - start }
        }

        return { status: 'ok', data: crux, durationMs: Date.now() - start }
    } catch (err) {
        return {
            status: 'error',
            error: err instanceof Error ? err.message : 'CrUX extraction failed',
            durationMs: Date.now() - start,
        }
    }
}

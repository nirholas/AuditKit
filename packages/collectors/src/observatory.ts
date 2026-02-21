import type { CollectorResult, SecurityData } from './types.js'

const OBSERVATORY_API = 'https://http-observatory.security.mozilla.org/api/v1'

export async function collectSecurity(url: string): Promise<CollectorResult<SecurityData>> {
    const start = Date.now()
    try {
        const host = new URL(url).hostname

        // Mozilla Observatory API
        const [triggerRes] = await Promise.allSettled([
            fetch(`${OBSERVATORY_API}/analyze?host=${host}`, {
                method: 'POST',
                body: new URLSearchParams({ hidden: 'true', rescan: 'false' }),
                signal: AbortSignal.timeout(20_000),
            }),
        ])

        // Fetch headers directly regardless of Observatory
        const headersRes = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(10_000),
        }).catch(() => null)

        const headers = {
            csp: headersRes?.headers.get('content-security-policy') ?? undefined,
            hsts: headersRes?.headers.get('strict-transport-security') ?? undefined,
            xFrameOptions: headersRes?.headers.get('x-frame-options') ?? undefined,
            xContentTypeOptions: headersRes?.headers.get('x-content-type-options') ?? undefined,
            referrerPolicy: headersRes?.headers.get('referrer-policy') ?? undefined,
            permissionsPolicy: headersRes?.headers.get('permissions-policy') ?? undefined,
        }

        const missing: string[] = []
        if (!headers.csp) missing.push('Content-Security-Policy')
        if (!headers.hsts) missing.push('Strict-Transport-Security')
        if (!headers.xFrameOptions && !headers.csp?.includes('frame-ancestors'))
            missing.push('X-Frame-Options')
        if (!headers.xContentTypeOptions) missing.push('X-Content-Type-Options')
        if (!headers.referrerPolicy) missing.push('Referrer-Policy')
        if (!headers.permissionsPolicy) missing.push('Permissions-Policy')

        // Observatory score
        let grade: string | undefined
        if (triggerRes.status === 'fulfilled' && triggerRes.value.ok) {
            const json = await triggerRes.value.json().catch(() => null) as Record<string, unknown> | null
            grade = json?.['grade'] as string | undefined
        }

        const data: SecurityData = {
            grade,
            headers,
            missing,
            sslValid: url.startsWith('https://'),
        }

        return { status: 'ok', data, durationMs: Date.now() - start }
    } catch (err) {
        return {
            status: 'error',
            error: err instanceof Error ? err.message : 'Security check failed',
            durationMs: Date.now() - start,
        }
    }
}

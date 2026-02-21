import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runAudit } from '@auditkit/analyzer'

const RequestSchema = z.object({
    url: z.string().url(),
    type: z.enum(['url', 'github']),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = RequestSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid URL. Please enter a valid https:// address or GitHub repo URL.' },
                { status: 400 },
            )
        }

        const { url, type } = parsed.data
        const result = await runAudit({ url, type })

        return NextResponse.json(result)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Audit failed'
        console.error('[audit]', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export const maxDuration = 60 // Vercel Pro / Cloud Run: allow up to 60s

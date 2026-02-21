import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runAudit } from '@auditkit/analyzer'
import { generateAgentsMd, generateClaudeMd, generateGeminiMd, generateSkillMd } from '@auditkit/generator'

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

        // Generate brief preview so the UI can show file contents before download
        const briefPreview = {
            agentsMd: generateAgentsMd(result),
            claudeMd: generateClaudeMd(result),
            geminiMd: generateGeminiMd(result),
            skills: Object.fromEntries(
                result.pillars
                    .filter((p) => p.issues.length > 0)
                    .map((p) => [p.id, generateSkillMd(p.label, p.issues, url)]),
            ),
        }

        return NextResponse.json({ ...result, briefPreview })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Audit failed'
        console.error('[audit]', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export const maxDuration = 60 // Vercel Pro / Cloud Run: allow up to 60s

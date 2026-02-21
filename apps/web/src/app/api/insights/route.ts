import { NextRequest } from 'next/server'
import Groq from 'groq-sdk'
import type { AuditResult } from '@auditkit/analyzer'

export const maxDuration = 30

export async function POST(req: NextRequest) {
    const apiKey = process.env['GROQ_API_KEY']
    if (!apiKey) {
        return new Response('GROQ_API_KEY not configured', { status: 503 })
    }

    let result: AuditResult
    try {
        result = await req.json() as AuditResult
    } catch {
        return new Response('Invalid JSON', { status: 400 })
    }

    const groq = new Groq({ apiKey })

    // Build a concise audit summary for the prompt
    const pillarSummary = result.pillars
        .map((p) => {
            const criticals = p.issues.filter((i) => i.severity === 'critical')
            const warnings = p.issues.filter((i) => i.severity === 'warning')
            const issueLines = [...criticals, ...warnings]
                .slice(0, 3)
                .map((i) => `    - ${i.title}: ${i.description}${i.fix ? ` → ${i.fix}` : ''}`)
                .join('\n')
            return `**${p.label}**: ${p.score}/100${issueLines ? `\n${issueLines}` : ''}`
        })
        .join('\n')

    const overallScore = Math.round(
        result.pillars.reduce((s, p) => s + p.score, 0) / result.pillars.length,
    )

    const allCriticals = result.pillars.flatMap((p) =>
        p.issues.filter((i) => i.severity === 'critical').map((i) => `${p.label}: ${i.title}`),
    )

    const prompt = `You are an expert web performance and SEO engineer reviewing an audit for ${result.url}.

Audit results (overall score: ${overallScore}/100):
${pillarSummary}

${allCriticals.length > 0 ? `Critical issues: ${allCriticals.join(', ')}` : 'No critical issues found.'}

Write a concise expert analysis (300–400 words) with these sections:

## 🔍 Key Findings
2–3 sentences on what the data tells you about this site's biggest strengths and weak points.

## ⚡ Priority Fixes (Biggest ROI)
3–5 bullet points. For each: explain *why* it matters (the business/user impact), not just *what* it is. Be specific about numbers where possible.

## 🚀 Quick Wins (< 1 hour each)
2–3 fixes that are fast to implement but have outsized impact.

## 📈 Expected Impact
After all critical + warning fixes: estimate the score improvements per pillar.

Be direct, technical, and specific. No fluff. Use exact metric names (LCP, CSP, HSTS, etc).`

    const stream = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 600,
        temperature: 0.4,
    })

    // Stream the response as plain text
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of stream) {
                    const text = chunk.choices[0]?.delta?.content ?? ''
                    if (text) controller.enqueue(encoder.encode(text))
                }
            } finally {
                controller.close()
            }
        },
    })

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'X-Content-Type-Options': 'nosniff',
        },
    })
}

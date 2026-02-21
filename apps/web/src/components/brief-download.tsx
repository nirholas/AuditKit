'use client'

import { useState } from 'react'
import { Download, Loader2, FileText, Check } from 'lucide-react'
import type { AuditResult } from '@auditkit/analyzer'

interface BriefDownloadProps {
    result: AuditResult
}

export function BriefDownload({ result }: BriefDownloadProps) {
    const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle')

    async function handleDownload() {
        setStatus('generating')
        try {
            const { generateBriefZip } = await import('@auditkit/generator')
            const blob = await generateBriefZip(result)
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const domain = new URL(result.url).hostname.replace('www.', '')
            a.download = `auditkit-brief-${domain}.zip`
            a.click()
            URL.revokeObjectURL(url)
            setStatus('done')
            setTimeout(() => setStatus('idle'), 3000)
        } catch (err) {
            console.error('Failed to generate brief:', err)
            setStatus('idle')
        }
    }

    const totalIssues = result.pillars.reduce((sum, p) => sum + p.issues.length, 0)
    const criticalIssues = result.pillars.flatMap((p) => p.issues).filter((i) => i.severity === 'critical').length

    return (
        <div
            className="rounded-2xl p-px"
            style={{ background: 'linear-gradient(135deg, rgba(147,197,253,0.2) 0%, rgba(129,140,248,0.1) 100%)' }}
        >
            <div
                className="rounded-2xl p-6"
                style={{ background: 'linear-gradient(135deg, rgba(147,197,253,0.06) 0%, rgba(129,140,248,0.03) 100%)', backdropFilter: 'blur(16px)' }}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-white/90">AI Agent Brief</h3>
                        <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'rgba(186,210,255,0.45)' }}>
                            Download a ZIP with AGENTS.md, CLAUDE.md, GEMINI.md, per-issue skill files,
                            checklists, and ready-to-deploy fix configs.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs" style={{ color: 'rgba(147,197,253,0.45)' }}>
                            {['AGENTS.md · CLAUDE.md · GEMINI.md', `${Math.min(totalIssues, 6)} skill files`, 'robots.txt · security headers · JSON-LD'].map((item) => (
                                <span key={item} className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {item}
                                </span>
                            ))}
                        </div>
                        {criticalIssues > 0 && (
                            <p className="mt-2 text-xs" style={{ color: 'rgba(248,113,113,0.7)' }}>
                                {criticalIssues} critical {criticalIssues === 1 ? 'issue' : 'issues'} included
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={status !== 'idle'}
                        className="btn-glow flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {status === 'generating' && <Loader2 className="h-4 w-4 animate-spin" />}
                        {status === 'done' && <Check className="h-4 w-4" />}
                        {status === 'idle' && <Download className="h-4 w-4" />}
                        {status === 'generating' ? 'Generating…' : status === 'done' ? 'Downloaded!' : 'Download Brief'}
                    </button>
                </div>
            </div>
        </div>
    )
}

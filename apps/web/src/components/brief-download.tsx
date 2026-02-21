'use client'

import { useState } from 'react'
import { Download, Loader2, FileText, Check, ChevronDown, ChevronUp } from 'lucide-react'
import type { AuditResult } from '@auditkit/analyzer'

interface BriefDownloadProps {
    result: AuditResult
}

export function BriefDownload({ result }: BriefDownloadProps) {
    const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle')
    const [previewOpen, setPreviewOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<string>('agentsMd')

    const bp = result.briefPreview
    const tabList = bp
        ? [
            { key: 'agentsMd', label: 'AGENTS.md' },
            { key: 'claudeMd', label: 'CLAUDE.md' },
            { key: 'geminiMd', label: 'GEMINI.md' },
            ...Object.keys(bp.skills).map((k) => ({ key: `skill:${k}`, label: k })),
        ]
        : []

    function getTabContent(key: string): string {
        if (!bp) return ''
        if (key === 'agentsMd') return bp.agentsMd
        if (key === 'claudeMd') return bp.claudeMd
        if (key === 'geminiMd') return bp.geminiMd
        const skillKey = key.replace('skill:', '')
        return bp.skills[skillKey] ?? ''
    }

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
                {/* Top row: info + actions */}
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

                    <div className="flex shrink-0 flex-col items-end gap-2">
                        {/* Preview toggle */}
                        {bp && tabList.length > 0 && (
                            <button
                                onClick={() => setPreviewOpen((v) => !v)}
                                className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-medium transition-colors"
                                style={{
                                    border: '1px solid rgba(147,197,253,0.2)',
                                    background: previewOpen ? 'rgba(147,197,253,0.1)' : 'rgba(147,197,253,0.04)',
                                    color: 'rgba(147,197,253,0.75)',
                                }}
                            >
                                {previewOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                {previewOpen ? 'Hide Preview' : 'Preview Files'}
                            </button>
                        )}

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            disabled={status !== 'idle'}
                            className="btn-glow flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {status === 'generating' && <Loader2 className="h-4 w-4 animate-spin" />}
                            {status === 'done' && <Check className="h-4 w-4" />}
                            {status === 'idle' && <Download className="h-4 w-4" />}
                            {status === 'generating' ? 'Generating…' : status === 'done' ? 'Downloaded!' : 'Download Brief'}
                        </button>
                    </div>
                </div>

                {/* Preview panel */}
                {previewOpen && bp && (
                    <div className="mt-5 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(147,197,253,0.12)' }}>
                        {/* Tab bar */}
                        <div
                            className="flex overflow-x-auto"
                            style={{ background: 'rgba(147,197,253,0.04)', borderBottom: '1px solid rgba(147,197,253,0.1)' }}
                        >
                            {tabList.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className="shrink-0 px-4 py-2.5 text-xs font-medium transition-colors"
                                    style={{
                                        color: activeTab === t.key ? 'rgba(147,197,253,0.95)' : 'rgba(147,197,253,0.4)',
                                        borderBottom: activeTab === t.key ? '2px solid rgba(147,197,253,0.7)' : '2px solid transparent',
                                        background: activeTab === t.key ? 'rgba(147,197,253,0.08)' : 'transparent',
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <pre
                            className="overflow-auto p-4 text-xs leading-relaxed"
                            style={{
                                maxHeight: '28rem',
                                background: 'rgba(5,5,15,0.6)',
                                color: 'rgba(186,210,255,0.75)',
                                fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}
                        >
                            {getTabContent(activeTab)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}

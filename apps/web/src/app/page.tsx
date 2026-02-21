'use client'

import { useState } from 'react'
import { UrlInput } from '@/components/url-input'
import { AuditDashboard } from '@/components/audit-dashboard'
import type { AuditResult } from '@auditkit/analyzer'

type AuditState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'done'; result: AuditResult }
    | { status: 'error'; message: string }

export default function Home() {
    const [state, setState] = useState<AuditState>({ status: 'idle' })

    async function handleAudit(url: string, type: 'url' | 'github') {
        setState({ status: 'loading' })
        try {
            const res = await fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, type }),
            })
            if (!res.ok) {
                const { error } = await res.json()
                setState({ status: 'error', message: error ?? 'Audit failed' })
                return
            }
            const result: AuditResult = await res.json()
            setState({ status: 'done', result })
        } catch (err) {
            setState({
                status: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
            })
        }
    }

    return (
        <main className="relative flex min-h-screen flex-col items-center px-4 py-20">
            {/* Aurora background */}
            <div className="aurora-bg">
                <div className="aurora-orb aurora-orb-1" />
                <div className="aurora-orb aurora-orb-2" />
                <div className="aurora-orb aurora-orb-3" />
            </div>

            {/* Content sits above aurora */}
            <div className="relative z-10 flex w-full flex-col items-center">

                {/* Hero — only when idle or error */}
                {(state.status === 'idle' || state.status === 'error') && (
                    <div className="mb-14 flex flex-col items-center text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-blue-200/70 backdrop-blur-sm">
                            Open Source · Free · No Login
                        </div>
                        <h1 className="text-6xl font-bold tracking-tight text-white" style={{ textShadow: '0 0 80px rgba(147,197,253,0.3)' }}>
                            Audit<span style={{ background: 'linear-gradient(135deg, #93c5fd 0%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kit</span>
                        </h1>
                        <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: 'rgba(186,210,255,0.55)' }}>
                            Paste a URL or GitHub repo. Get scores for performance, SEO, accessibility,
                            security, and AI readiness — then download a ready-to-run agent brief.
                        </p>

                        {/* Pillar pills */}
                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                            {['Performance', 'SEO', 'Accessibility', 'Security', 'Structured Data', 'AI Readiness'].map((label) => (
                                <span
                                    key={label}
                                    className="rounded-full border px-3 py-1 text-xs"
                                    style={{ borderColor: 'rgba(147,197,253,0.15)', color: 'rgba(186,210,255,0.5)', background: 'rgba(147,197,253,0.04)' }}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                {state.status !== 'done' && (
                    <UrlInput
                        onAudit={handleAudit}
                        isLoading={state.status === 'loading'}
                    />
                )}

                {/* Error */}
                {state.status === 'error' && (
                    <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/8 px-5 py-4 text-sm text-red-300 backdrop-blur-sm">
                        {state.message}
                    </div>
                )}

                {/* Loading */}
                {state.status === 'loading' && (
                    <div className="mt-16 flex flex-col items-center gap-5">
                        {/* Glowing spinner */}
                        <div className="relative h-12 w-12">
                            <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(147,197,253,0.8) 100%)', animation: 'spin 1s linear infinite', borderRadius: '50%' }} />
                            <div className="absolute inset-1 rounded-full" style={{ background: '#05050f' }} />
                        </div>
                        <p className="text-sm" style={{ color: 'rgba(186,210,255,0.5)' }}>Running collectors in parallel…</p>
                        <ul className="mt-1 space-y-1.5">
                            {[
                                'PageSpeed Insights',
                                'Chrome UX Report',
                                'SEO & Meta tags',
                                'Security headers',
                                'Structured data',
                                'AI readiness signals',
                            ].map((item, i) => (
                                <li key={item} className="flex items-center gap-2.5 text-xs" style={{ color: 'rgba(147,197,253,0.4)', animationDelay: `${i * 0.15}s` }}>
                                    <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(147,197,253,0.6)', animationDelay: `${i * 0.2}s` }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Results */}
                {state.status === 'done' && (
                    <AuditDashboard
                        result={state.result}
                        onReset={() => setState({ status: 'idle' })}
                    />
                )}

            </div>
        </main>
    )
}

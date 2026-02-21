'use client'

import type { AuditResult } from '@auditkit/analyzer'
import { PillarCard } from './pillar-card'
import { BriefDownload } from './brief-download'
import { ScoreRing } from './score-ring'
import { ExternalLink, RefreshCw } from 'lucide-react'

interface AuditDashboardProps {
    result: AuditResult
    onReset: () => void
}

export function AuditDashboard({ result, onReset }: AuditDashboardProps) {
    const overallScore = Math.round(
        result.pillars.reduce((sum, p) => sum + p.score, 0) / result.pillars.length,
    )

    return (
        <div className="w-full max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onReset}
                        className="rounded-xl p-2 transition-colors"
                        style={{
                            border: '1px solid rgba(147,197,253,0.15)',
                            background: 'rgba(147,197,253,0.04)',
                            color: 'rgba(147,197,253,0.45)',
                        }}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <div>
                        <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                            style={{ color: 'rgba(186,210,255,0.9)' }}
                        >
                            {result.url}
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <p className="text-xs" style={{ color: 'rgba(147,197,253,0.35)' }}>
                            Audited {new Date(result.auditedAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Overall score */}
                <div
                    className="flex items-center gap-4 rounded-2xl px-6 py-3"
                    style={{
                        border: '1px solid rgba(147,197,253,0.12)',
                        background: 'rgba(147,197,253,0.04)',
                        backdropFilter: 'blur(16px)',
                    }}
                >
                    <ScoreRing score={overallScore} size={68} label="Overall" />
                </div>
            </div>

            {/* AI Brief Download */}
            <BriefDownload result={result} />

            {/* Pillar grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.pillars.map((pillar) => (
                    <PillarCard key={pillar.id} pillar={pillar} />
                ))}
            </div>

            {/* Raw metadata */}
            {result.meta && (
                <div
                    className="rounded-2xl p-5"
                    style={{
                        border: '1px solid rgba(147,197,253,0.1)',
                        background: 'rgba(147,197,253,0.03)',
                        backdropFilter: 'blur(16px)',
                    }}
                >
                    <h3 className="mb-3 text-sm font-semibold" style={{ color: 'rgba(186,210,255,0.8)' }}>Page Metadata</h3>
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:grid-cols-3">
                        {result.meta.title && (
                            <>
                                <dt style={{ color: 'rgba(147,197,253,0.35)' }}>Title</dt>
                                <dd className="col-span-1 truncate sm:col-span-2" style={{ color: 'rgba(186,210,255,0.85)' }}>{result.meta.title}</dd>
                            </>
                        )}
                        {result.meta.description && (
                            <>
                                <dt style={{ color: 'rgba(147,197,253,0.35)' }}>Description</dt>
                                <dd className="col-span-1 truncate sm:col-span-2" style={{ color: 'rgba(186,210,255,0.85)' }}>{result.meta.description}</dd>
                            </>
                        )}
                        {result.meta.canonical && (
                            <>
                                <dt style={{ color: 'rgba(147,197,253,0.35)' }}>Canonical</dt>
                                <dd className="col-span-1 truncate sm:col-span-2" style={{ color: 'rgba(147,197,253,0.5)' }}>{result.meta.canonical}</dd>
                            </>
                        )}
                        {result.meta.tech && result.meta.tech.length > 0 && (
                            <>
                                <dt style={{ color: 'rgba(147,197,253,0.35)' }}>Tech</dt>
                                <dd className="col-span-1 sm:col-span-2" style={{ color: 'rgba(186,210,255,0.85)' }}>{result.meta.tech.join(', ')}</dd>
                            </>
                        )}
                    </dl>
                </div>
            )}
        </div>
    )
}

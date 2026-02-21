'use client'

import type { PillarScore } from '@auditkit/analyzer'
import { ScoreRing } from './score-ring'
import { scoreColor } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface PillarCardProps {
    pillar: PillarScore
}

export function PillarCard({ pillar }: PillarCardProps) {
    const [expanded, setExpanded] = useState(false)
    const criticalCount = pillar.issues.filter((i) => i.severity === 'critical').length
    const warningCount = pillar.issues.filter((i) => i.severity === 'warning').length

    return (
        <div
            className="glass rounded-2xl p-5 transition-all duration-200"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 pr-3">
                    <h3 className="text-sm font-semibold text-white/90">{pillar.label}</h3>
                    <div className="mt-1.5 flex gap-2 text-xs">
                        {criticalCount > 0 && (
                            <span style={{ color: '#f87171' }}>{criticalCount} critical</span>
                        )}
                        {warningCount > 0 && (
                            <span style={{ color: '#fbbf24' }}>{warningCount} warning{warningCount !== 1 ? 's' : ''}</span>
                        )}
                        {criticalCount === 0 && warningCount === 0 && (
                            <span style={{ color: '#4ade80' }}>All clear</span>
                        )}
                    </div>
                </div>
                <ScoreRing score={pillar.score} size={68} />
            </div>

            {pillar.issues.length > 0 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-4 flex w-full items-center justify-between text-xs transition-colors"
                    style={{ color: 'rgba(147,197,253,0.35)' }}
                >
                    <span>{expanded ? 'Hide' : 'Show'} {pillar.issues.length} issue{pillar.issues.length !== 1 ? 's' : ''}</span>
                    {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
            )}

            {expanded && (
                <ul className="mt-3 space-y-2">
                    {pillar.issues.map((issue, i) => (
                        <li
                            key={i}
                            className="rounded-xl px-3 py-2.5"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <div className="flex items-start gap-2">
                                <span
                                    className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                                    style={issue.severity === 'critical'
                                        ? { background: 'rgba(248,113,113,0.12)', color: '#f87171' }
                                        : issue.severity === 'warning'
                                            ? { background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }
                                            : { background: 'rgba(147,197,253,0.1)', color: '#93c5fd' }
                                    }
                                >
                                    {issue.severity}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-white/80">{issue.title}</p>
                                    <p className="text-xs" style={{ color: 'rgba(186,210,255,0.35)' }}>{issue.description}</p>
                                    {issue.fix && (
                                        <p className="mt-1 text-xs" style={{ color: 'rgba(147,197,253,0.6)' }}>↳ {issue.fix}</p>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

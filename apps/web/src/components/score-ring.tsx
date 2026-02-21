'use client'

import { scoreRingColor, scoreColor } from '@/lib/utils'

interface ScoreRingProps {
    score: number
    size?: number
    label?: string
}

export function ScoreRing({ score, size = 80, label }: ScoreRingProps) {
    const radius = (size - 10) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference
    const color = scoreRingColor(score)

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90" style={{ position: 'absolute', inset: 0 }}>
                    {/* Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.07)"
                        strokeWidth={5}
                    />
                    {/* Glow layer */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={8}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ opacity: 0.25, filter: 'blur(4px)', transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                    {/* Main ring */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={5}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                </svg>
                {/* Score number centred */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold tabular-nums ${scoreColor(score)}`} style={{ fontSize: size * 0.27 }}>{score}</span>
                </div>
            </div>
            {label && <span className="text-xs" style={{ color: 'rgba(147,197,253,0.4)' }}>{label}</span>}
        </div>
    )
}

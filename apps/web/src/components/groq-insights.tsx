'use client'

import { useEffect, useRef, useState } from 'react'
import type { AuditResult } from '@auditkit/collectors'

interface GroqInsightsProps {
    result: AuditResult
}

export default function GroqInsights({ result }: GroqInsightsProps) {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        const controller = new AbortController()
        abortRef.current = controller

        async function fetchInsights() {
            setLoading(true)
            setContent('')
            setError(null)

            try {
                const res = await fetch('/api/insights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(result),
                    signal: controller.signal,
                })

                if (res.status === 503) {
                    // No Groq key configured — silently hide component
                    setError('NO_KEY')
                    return
                }

                if (!res.ok) {
                    setError('Failed to load insights.')
                    return
                }

                const reader = res.body?.getReader()
                if (!reader) {
                    setError('Stream unavailable.')
                    return
                }

                const decoder = new TextDecoder()
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    setContent((prev) => prev + decoder.decode(value, { stream: true }))
                }
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    setError('Could not load insights.')
                }
            } finally {
                setLoading(false)
            }
        }

        void fetchInsights()

        return () => {
            controller.abort()
        }
    }, [result])

    // Silently hide if no API key
    if (error === 'NO_KEY') return null

    return (
        <div className="glass rounded-2xl p-6 mb-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: 'rgba(147,197,253,0.12)', border: '1px solid rgba(147,197,253,0.25)' }}
                >
                    ✦
                </div>
                <div>
                    <h3 className="font-semibold text-white text-base leading-tight">
                        AI Insights
                    </h3>
                    <p className="text-xs" style={{ color: 'rgba(147,197,253,0.55)' }}>
                        Powered by Groq · llama-3.3-70b-versatile
                    </p>
                </div>
                {loading && (
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'rgba(147,197,253,0.55)' }}>
                            Analyzing
                        </span>
                        <Pulse />
                    </div>
                )}
            </div>

            {/* Content */}
            {error && error !== 'NO_KEY' ? (
                <p className="text-sm" style={{ color: 'rgba(252,165,165,0.8)' }}>
                    {error}
                </p>
            ) : (
                <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: 'rgba(226,232,240,0.85)' }}
                >
                    <MarkdownLite text={content} />
                    {loading && !content && (
                        <div className="flex gap-1.5 mt-1">
                            {[0, 0.15, 0.3].map((d) => (
                                <span
                                    key={d}
                                    className="inline-block w-1.5 h-1.5 rounded-full animate-bounce"
                                    style={{
                                        background: 'rgba(147,197,253,0.6)',
                                        animationDelay: `${d}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

/** Minimal Markdown renderer: bold, headings, bullets */
function MarkdownLite({ text }: { text: string }) {
    if (!text) return null

    const lines = text.split('\n')

    return (
        <>
            {lines.map((line, i) => {
                if (line.startsWith('## ')) {
                    return (
                        <h4
                            key={i}
                            className="font-semibold text-white mt-4 mb-1.5 text-sm"
                        >
                            {line.replace('## ', '')}
                        </h4>
                    )
                }
                if (line.startsWith('- ') || line.startsWith('• ')) {
                    const content = renderInline(line.replace(/^[-•]\s/, ''))
                    return (
                        <div key={i} className="flex gap-2 mb-1">
                            <span style={{ color: 'rgba(147,197,253,0.6)' }}>·</span>
                            <span>{content}</span>
                        </div>
                    )
                }
                if (line.trim() === '') {
                    return <div key={i} className="h-1" />
                }
                return <p key={i} className="mb-1">{renderInline(line)}</p>
            })}
        </>
    )
}

function renderInline(text: string) {
    // Bold: **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={i} className="font-semibold" style={{ color: 'rgba(147,197,253,0.9)' }}>
                    {part.slice(2, -2)}
                </strong>
            )
        }
        return <span key={i}>{part}</span>
    })
}

function Pulse() {
    return (
        <span className="relative flex h-2 w-2">
            <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: 'rgba(147,197,253,0.6)' }}
            />
            <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: 'rgba(147,197,253,0.9)' }}
            />
        </span>
    )
}

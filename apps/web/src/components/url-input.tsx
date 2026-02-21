'use client'

import { useState } from 'react'
import { Search, Github, Globe } from 'lucide-react'
import { cn, cleanUrl, isGitHubUrl } from '@/lib/utils'

interface UrlInputProps {
    onAudit: (url: string, type: 'url' | 'github') => void
    isLoading?: boolean
}

export function UrlInput({ onAudit, isLoading }: UrlInputProps) {
    const [value, setValue] = useState('')
    const [focused, setFocused] = useState(false)

    const detectedType = isGitHubUrl(value) ? 'github' : 'url'

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!value.trim()) return
        onAudit(cleanUrl(value), detectedType)
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div
                className={cn('input-glow relative flex items-center rounded-2xl border transition-all duration-300')}
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderColor: focused ? 'rgba(147,197,253,0.45)' : 'rgba(255,255,255,0.09)',
                }}
            >
                {/* Icon */}
                <div className="flex items-center pl-4" style={{ color: 'rgba(147,197,253,0.5)' }}>
                    {detectedType === 'github' ? (
                        <Github className="h-5 w-5" style={{ color: 'rgba(147,197,253,0.8)' }} />
                    ) : (
                        <Globe className="h-5 w-5" />
                    )}
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="https://yoursite.com or github.com/owner/repo"
                    className="flex-1 bg-transparent px-4 py-4 text-base text-white outline-none"
                    style={{ caretColor: '#93c5fd' }}
                    autoComplete="off"
                    spellCheck={false}
                />

                <button
                    type="submit"
                    disabled={!value.trim() || isLoading}
                    className={cn(
                        'mr-2 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-150',
                        value.trim() && !isLoading
                            ? 'btn-glow text-white'
                            : 'cursor-not-allowed text-white/20',
                    )}
                    style={!value.trim() || isLoading ? { background: 'rgba(255,255,255,0.06)' } : {}}
                >
                    {isLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                    {isLoading ? 'Auditing…' : 'Audit'}
                </button>
            </div>

            {/* Type hint */}
            <p className="mt-2.5 px-1 text-xs" style={{ color: 'rgba(147,197,253,0.35)' }}>
                {detectedType === 'github'
                    ? '↳ GitHub mode — repo hygiene, AI readiness, CI/CD, security'
                    : '↳ URL mode — performance, SEO, accessibility, security headers, structured data'}
            </p>
        </form>
    )
}

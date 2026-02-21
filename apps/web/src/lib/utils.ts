import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function scoreColor(score: number): string {
    if (score >= 90) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
}

export function scoreRingColor(score: number): string {
    if (score >= 90) return '#22c55e'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
}

export function severityColor(severity: 'critical' | 'warning' | 'info') {
    return {
        critical: 'text-red-400 bg-red-400/10 border-red-400/20',
        warning: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        info: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    }[severity]
}

export function isGitHubUrl(url: string): boolean {
    try {
        const parsed = new URL(url)
        return parsed.hostname === 'github.com'
    } catch {
        return false
    }
}

export function cleanUrl(input: string): string {
    let url = input.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`
    }
    return url
}

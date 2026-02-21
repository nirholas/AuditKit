import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'AuditKit — Full-Stack Website & Repo Auditor',
    description:
        'Paste a URL or GitHub repo and get PageSpeed, SEO, accessibility, security, structured data, and AI-readiness scores — plus a ready-to-use AI agent brief you can deploy immediately.',
    openGraph: {
        title: 'AuditKit',
        description: 'Full-stack website & repo auditor. Audit → Score → Generate AI fix brief.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    )
}

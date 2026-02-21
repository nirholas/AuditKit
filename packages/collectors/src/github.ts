import type { CollectorResult, GitHubData } from './types.js'

// GitHub unauthenticated REST API — 60 req/hour per IP, plenty for user-triggered audits
const GH_API = 'https://api.github.com'
// raw.githubusercontent.com HEAD checks — no API, no token, no rate limit
const GH_RAW = 'https://raw.githubusercontent.com'

const GH_HEADERS = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'AuditKit/1.0',
} as const

/** Check whether a file exists in a public GitHub repo via raw content URL */
function rawExists(owner: string, repo: string, branch: string, ...paths: string[]): Promise<boolean>[] {
    return paths.map((p) =>
        fetch(`${GH_RAW}/${owner}/${repo}/${branch}/${p}`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(6_000),
        }).then((r) => r.ok).catch(() => false),
    )
}

export async function collectGitHub(repoUrl: string): Promise<CollectorResult<GitHubData>> {
    const start = Date.now()
    try {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?#]+)/)
        if (!match?.[1] || !match[2]) {
            return { status: 'error', error: 'Invalid GitHub URL', durationMs: 0 }
        }

        const [, owner, repo] = match
        const get = (path: string) =>
            fetch(`${GH_API}${path}`, { headers: GH_HEADERS, signal: AbortSignal.timeout(10_000) })

        // 1. Fetch repo metadata (stars, license, etc.) — unauthenticated is fine
        const repoRes = await get(`/repos/${owner}/${repo}`)
        if (!repoRes.ok) {
            return {
                status: 'error',
                error: 'GitHub repo not found or rate limited',
                durationMs: Date.now() - start,
            }
        }
        const repoData = await repoRes.json()
        const branch: string = repoData.default_branch ?? 'HEAD'

        // 2. Check last commit date
        const commitsRes = await get(`/repos/${owner}/${repo}/commits?per_page=1`).catch(() => null)
        let daysSinceLastCommit = 999
        if (commitsRes?.ok) {
            const commits = await commitsRes.json()
            const lastCommitDate = commits?.[0]?.commit?.committer?.date
            if (lastCommitDate) {
                daysSinceLastCommit = Math.floor(
                    (Date.now() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24),
                )
            }
        }

        // 3. Check individual files via raw.githubusercontent.com HEAD requests (no token, no rate limit)
        const [
            hasReadme, hasLicense, hasContributing, hasCodeOfConduct, hasSecurity,
            hasCodeowners, hasAgentsMd, hasClaude, hasGemini, hasCopilotInstructions,
            hasLlmsTxt, hasLlmsFullTxt, hasWorkflows, hasDependabot, hasPrTemplate, hasIssueTemplates,
        ] = await Promise.all([
            // root doc files
            ...rawExists(owner, repo, branch,
                'README.md', 'LICENSE', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'SECURITY.md',
            ),
            // codeowners
            rawExists(owner, repo, branch, '.github/CODEOWNERS')[0]!,
            // AI agent files
            ...rawExists(owner, repo, branch, 'AGENTS.md', 'CLAUDE.md', 'GEMINI.md',
                '.github/copilot-instructions.md'),
            // llms
            ...rawExists(owner, repo, branch, 'llms.txt', 'llms-full.txt'),
            // workflows / dependabot / PR template / issue templates
            rawExists(owner, repo, branch, '.github/workflows')[0]!,
            rawExists(owner, repo, branch, '.github/dependabot.yml')[0]!,
            rawExists(owner, repo, branch, '.github/PULL_REQUEST_TEMPLATE.md')[0]!,
            fetch(`${GH_API}/repos/${owner}/${repo}/contents/.github/ISSUE_TEMPLATE`, {
                headers: GH_HEADERS, signal: AbortSignal.timeout(6_000),
            }).then((r) => r.ok).catch(() => false),
        ])

        const data: GitHubData = {
            owner: owner ?? '',
            repo: repo ?? '',
            description: repoData.description,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            openIssues: repoData.open_issues_count,
            license: repoData.license?.spdx_id,
            defaultBranch: branch,
            hasReadme,
            hasLicense,
            hasContributing,
            hasCodeOfConduct,
            hasSecurity,
            hasCodeowners,
            hasAgentsMd,
            hasClaude,
            hasGemini,
            hasCopilotInstructions,
            hasLlmsTxt: hasLlmsTxt || hasLlmsFullTxt,
            hasGithubWorkflows: hasWorkflows,
            hasDependabot,
            hasBranchProtection: false, // requires admin token
            hasIssueTemplates,
            hasPrTemplate,
            topicsCount: (repoData.topics ?? []).length,
            latestRelease: repoData.pushed_at,
            daysSinceLastCommit,
        }

        return { status: 'ok', data, durationMs: Date.now() - start }
    } catch (err) {
        return {
            status: 'error',
            error: err instanceof Error ? err.message : 'GitHub collection failed',
            durationMs: Date.now() - start,
        }
    }
}

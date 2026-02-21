# AI Readiness Skill — AuditKit

This skill is auto-included in the generated ZIP when the AI Readiness pillar score is below 90.

AI Readiness measures how discoverable and usable your project is by AI coding agents, LLM crawlers, and vibe-coders who ask their AI about your tool.

---

## llms.txt

The `llms.txt` standard (https://llmstxt.org) is a Markdown file at your domain root that gives LLMs context about your project — like `robots.txt` but for AI.

```
# YourProject

> One-sentence description of what your project does.

## Links
- Docs: https://yourdomain.com/docs
- Repo: https://github.com/you/project

## What it does
Brief description of capabilities, use cases, and how to get started.

## Quick Start
Installation and basic usage in 5 lines.

## License
MIT
```

Place at: `https://yourdomain.com/llms.txt`

For Next.js, create `public/llms.txt`.

---

## llms-full.txt

A longer version with complete API docs, type signatures, examples, and architecture context. Aimed at giving an LLM full context to work with your codebase without needing to read source files.

Place at: `https://yourdomain.com/llms-full.txt`

---

## AGENTS.md

Instructions for AI coding agents working in your repository. Should include:

```markdown
# AGENTS.md

## Project
Brief description.

## Tech Stack
- Framework, language, package manager

## Directory Map
Key directories and what they contain.

## Commands
\`\`\`bash
npm run dev
npm run build
npm run test
\`\`\`

## Conventions
- Code style preferences
- Patterns to follow
- Things to avoid
```

---

## CLAUDE.md / GEMINI.md

Same concept as AGENTS.md but with system-specific context:
- `CLAUDE.md` — Claude-specific notes (multi-file editing patterns, tool use preferences)
- `GEMINI.md` — Gemini-specific notes (context window usage, grounding)

---

## robots.txt — AI Crawler Directives

Allow AI crawlers explicitly so they index your content for training and search:

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

# Block specific paths from all bots
User-agent: *
Disallow: /private/
Allow: /
```

---

## GitHub Repository Hygiene

For GitHub repos, AI Readiness also checks:

| File | Why it matters |
|------|----------------|
| `README.md` | First thing an LLM reads about your project |
| `CONTRIBUTING.md` | AI agents follow contribution guidelines |
| `AGENTS.md` | Explicit AI agent instructions |
| `CLAUDE.md` | Claude-specific context |
| `GEMINI.md` | Gemini-specific context |
| `.github/copilot-instructions.md` | GitHub Copilot context |
| `llms.txt` | LLM-friendly project summary |
| `LICENSE` | Needed for AI training dataset classification |
| GitHub Topics | Makes repo discoverable in AI-powered search |

---

## Schema.org for AI Discovery

Structured data helps AI systems understand what your page is about:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "YourApp",
  "description": "What it does",
  "url": "https://yourdomain.com",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>
```

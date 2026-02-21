# SEO Skill — AuditKit

This skill is auto-included in the generated ZIP when the SEO pillar score is below 90.

## Critical Requirements

Every page MUST have:
- `<title>` tag (50–60 characters)
- `<meta name="description">` (120–158 characters)
- `<link rel="canonical">` pointing to the preferred URL
- At least one `<h1>` tag

## Meta Tags Checklist

```html
<head>
  <!-- Required -->
  <title>Page Title — Site Name</title>
  <meta name="description" content="120–158 char description of this specific page.">
  <link rel="canonical" href="https://yourdomain.com/page">

  <!-- Open Graph (required for social sharing) -->
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Description">
  <meta property="og:image" content="https://yourdomain.com/og-image.png">
  <meta property="og:url" content="https://yourdomain.com/page">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Page Title">
  <meta name="twitter:description" content="Description">
  <meta name="twitter:image" content="https://yourdomain.com/og-image.png">
</head>
```

## Next.js Metadata API

```typescript
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title — Site Name',
  description: '120–158 char description.',
  alternates: {
    canonical: 'https://yourdomain.com/page',
  },
  openGraph: {
    title: 'Page Title',
    description: 'Description',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title',
    description: 'Description',
    images: ['/og-image.png'],
  },
}
```

## robots.txt

```
# public/robots.txt
User-agent: *
Allow: /

# Allow AI crawlers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

## sitemap.xml

```typescript
// app/sitemap.ts (Next.js)
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://yourdomain.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    // add all pages
  ]
}
```

## Common Issues

| Issue | Fix |
|-------|-----|
| Missing `<title>` | Add `<title>` to every page's `<head>` |
| Duplicate titles | Each page needs a unique, descriptive title |
| Title too long (>60 chars) | Truncate — search engines will cut it anyway |
| No OG image | Create a 1200×630 image for each key page |
| Missing canonical | Add `<link rel="canonical">` or use Next.js metadata |
| No sitemap | Generate `/sitemap.xml` and submit to Google Search Console |
| Blocked in robots.txt | Ensure `Allow: /` is present |

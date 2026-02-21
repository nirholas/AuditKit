# Performance Skill — AuditKit

This skill is auto-included in the generated ZIP when the Performance pillar score is below 90.

## What it covers

Core Web Vitals (LCP, CLS, TBT/FID, FCP, TTFB, Speed Index) and general page weight / render-blocking resource issues.

## Thresholds (Google's "good" targets)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5–4s | > 4s |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |
| TBT (Total Blocking Time) | < 200ms | 200–600ms | > 600ms |
| FCP (First Contentful Paint) | < 1.8s | 1.8–3s | > 3s |
| TTFB (Time to First Byte) | < 800ms | 800ms–1.8s | > 1.8s |

## Common Fixes

### Slow LCP

```html
<!-- Preload the hero image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- Use modern image formats -->
<img src="/hero.webp" alt="..." width="1200" height="600" loading="eager">
```

```typescript
// Next.js — use next/image with priority
import Image from 'next/image'
<Image src="/hero.webp" alt="..." width={1200} height={600} priority />
```

### High CLS

```css
/* Always set explicit width/height on images */
img { width: 100%; height: auto; aspect-ratio: 16/9; }

/* Reserve space for ads / embeds */
.ad-slot { min-height: 250px; }
```

### Render-blocking resources

```html
<!-- Defer non-critical scripts -->
<script src="/analytics.js" defer></script>

<!-- Inline critical CSS, load rest async -->
<link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### High TTFB

- Enable edge caching (Vercel Edge Network, Cloudflare)
- Use `stale-while-revalidate` cache headers
- Move API calls to edge functions and cache responses
- Reduce server-side database queries

### Next.js specific

```typescript
// next.config.ts
const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

## Monitoring

After fixing, re-run AuditKit or use:
- https://pagespeed.web.dev — lab + field data
- https://web.dev/measure — detailed Lighthouse report
- Chrome DevTools → Performance tab → record page load

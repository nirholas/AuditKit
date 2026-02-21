# Structured Data Skill — AuditKit

This skill is auto-included in the generated ZIP when the Structured Data pillar score is below 90.

Structured data (Schema.org JSON-LD) helps search engines and AI systems understand your content type — enabling rich results in Google Search and better AI discoverability.

---

## JSON-LD Basics

Always use `application/ld+json` script tags in `<head>`. Never use Microdata or RDFa (JSON-LD is the recommended format per Google).

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Site Name",
  "url": "https://yourdomain.com",
  "description": "What your site does"
}
</script>
```

---

## Schema Types by Page Type

### Software / SaaS / Tool

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AuditKit",
  "description": "Zero-key website auditor that generates AI agent fix files",
  "url": "https://auditkit.dev",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Person",
    "name": "nirholas",
    "url": "https://github.com/nirholas"
  }
}
```

### Article / Blog Post

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Brief description",
  "datePublished": "2026-01-01",
  "dateModified": "2026-01-15",
  "author": { "@type": "Person", "name": "Author Name" },
  "publisher": {
    "@type": "Organization",
    "name": "Site Name",
    "logo": { "@type": "ImageObject", "url": "https://yourdomain.com/logo.png" }
  }
}
```

### Organization / Company

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://yourdomain.com",
  "logo": "https://yourdomain.com/logo.png",
  "sameAs": [
    "https://twitter.com/yourhandle",
    "https://github.com/yourhandle"
  ]
}
```

### FAQ Page

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does AuditKit require an API key?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. AuditKit works completely without API keys."
      }
    }
  ]
}
```

---

## Next.js Implementation

```typescript
// app/page.tsx
export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AuditKit',
    // ...
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* page content */}
    </>
  )
}
```

---

## Validation

After adding structured data, validate it:
- https://search.google.com/test/rich-results — Google's official validator
- https://validator.schema.org — Schema.org validator
- Google Search Console → Enhancements → check for errors

---

## sitemap.xml

Ensure every important page is in your sitemap and the sitemap is linked from `robots.txt`:

```typescript
// app/sitemap.ts (Next.js App Router)
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // one entry per page
  ]
}
```

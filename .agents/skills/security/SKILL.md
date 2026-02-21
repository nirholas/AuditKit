# Security Skill — AuditKit

This skill is auto-included in the generated ZIP when the Security pillar score is below 90.

## HTTP Security Headers

Add all of these to every response. Vercel users: add to `vercel.json`. Next.js users: add to `next.config.ts`.

### next.config.ts

```typescript
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // tighten after audit
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

### vercel.json

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

## HTTPS

- Ensure your domain has a valid TLS certificate
- Redirect all HTTP → HTTPS (Vercel does this automatically)
- Use HSTS preloading: https://hstspreload.org

## Content Security Policy (CSP)

Start permissive, then tighten:

```
# Start with report-only to find violations without breaking site:
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report
```

## Hide Server Information

```typescript
// next.config.ts — remove X-Powered-By header
export default {
  poweredByHeader: false,
}
```

## Dependency Security

```bash
# Check for known vulnerabilities
pnpm audit

# Auto-fix where possible
pnpm audit --fix
```

Enable Dependabot in `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
```

## Security.txt

Create `public/.well-known/security.txt` so researchers know how to report vulnerabilities:

```
Contact: https://github.com/yourrepo/security/advisories/new
Expires: 2027-01-01T00:00:00.000Z
Preferred-Languages: en
```

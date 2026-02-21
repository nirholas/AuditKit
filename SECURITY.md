# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest (main) | ✅ |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

To report a vulnerability, please open a [GitHub Security Advisory](https://github.com/nirholas/AuditKit/security/advisories/new) or email the maintainers directly.

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You will receive a response within 48 hours. If the issue is confirmed, we will release a patch as soon as possible.

## Scope

AuditKit is a read-only auditing tool. It makes outbound HTTP requests to the URL provided by the user. It does not store any URL, audit result, or user data server-side (Phase 1 is fully stateless).

**In scope:** XSS, SSRF (e.g. auditing internal IPs), ReDoS in URL parsing, supply-chain vulnerabilities in dependencies
**Out of scope:** Issues in third-party APIs that AuditKit calls, intentional limitations (e.g. no rate limiting on self-hosted deployments)

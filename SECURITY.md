# Security Policy

## Supported versions

Security fixes are prioritized for the latest release and the default development branch.

## Reporting a vulnerability

Do not disclose security vulnerabilities in public issues, pull requests, or chat forums.

Report vulnerabilities privately through the repository's GitHub Security Advisory tab or email security maintainers directly.

Please include:
- A description of the issue (e.g., XSS, token leakage, authentication bypass).
- Steps to reproduce or proof-of-concept.
- Affected application (`apps/web`, `apps/desktop`, `apps/secrets-share`, etc.).

## Scope

In scope:
- Web dashboard authentication, session management, and routing.
- Tauri desktop client privilege isolation and child process handling.
- Zero-knowledge end-to-end encryption in the secrets sharing tool (`apps/secrets-share`).
- Token and credential caching mechanisms.

# Agent Instructions

## Project boundary

This repository is the official Outpipe frontend monorepo. It contains the web dashboard, Tauri desktop app, public status pages, end-to-end encrypted secrets sharing application, and product documentation.

It communicates with Outpipe core relay and control planes via public HTTP APIs and WebSocket streams.

## Code style

- Keep files under 350 lines.
- Keep one component per TypeScript file.
- Use kebab-case for TypeScript and asset file names.
- Use named exports in TypeScript.
- Avoid comments, GoDoc, and JSDoc unless required by a tool or language directive.
- Use Biome for TypeScript and JSON formatting and linting. Never use Prettier.
- Keep tunnel networking and data-plane logic in Go or Tauri native layers rather than duplicating heavy network handling in browser JavaScript.

## Application architecture

- `apps/web/`: Main dashboard application (TanStack Start / React).
  - `src/routes/`: Route declarations. Do not edit generated route files by hand.
  - `src/components/`: Reusable presentation and UI components.
  - `src/features/`: Domain features (auth, tunnels, observability, uptime, billing, settings).
  - `src/hooks/`: Custom React hooks.
  - `src/lib/`: Client utilities and helpers.
- `apps/desktop/`: Standalone desktop client using Tauri v2.
  - `src-tauri/`: Rust backend, tray management, and child CLI process control.
- `apps/status/`: Public-facing status pages (Vue 3 / Vite).
- `apps/secrets-share/`: Zero-knowledge secrets sharing tool (Astro / React).
- `apps/docs/`: Documentation site (Astro).
- `packages/shared/`: Shared encryption primitives, styles, and branding assets.
- `packages/tauri-bridge/`: Typed communication bridge for desktop runtime.

## Security

- Never hardcode or log tokens, session cookies, user credentials, or decrypted secrets.
- Perform client-side cryptographic operations in `packages/shared/crypto.ts` with Web Crypto API standards.
- Ensure all route inputs and URL query parameters are validated and sanitized.

## Workflow

- Read files before editing them.
- Use targeted patches for edits.
- Run `npm run fmt` before finishing a change session.
- Run `npm run typecheck` and `npm test` to verify changes.
- Do not commit or push unless explicitly requested.

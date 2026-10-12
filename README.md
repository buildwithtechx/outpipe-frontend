# Outpipe Frontend

Dashboard, status pages, secret-share application, and desktop client for [Outpipe](https://github.com/buildwithtechx/outpipe).

## Applications

| Application | Path | Framework | Description |
| :--- | :--- | :--- | :--- |
| **Web Dashboard** | [`apps/web`](apps/web) | React / TanStack Router | Modern web management dashboard for tunnels, secrets, and observability |
| **Desktop Client** | [`apps/desktop`](apps/desktop) | Tauri / Rust + React | Cross-platform desktop application |
| **Public Status Pages** | [`apps/status`](apps/status) | Astro | High-performance public service status pages |
| **Secrets Share** | [`apps/secrets-share`](apps/secrets-share) | Astro | Zero-knowledge end-to-end encrypted secret sharing |
| **Documentation** | [`apps/docs`](apps/docs) | Astro | Public documentation and developer guides |

## Development

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Run web dashboard only
npm run dev:web

# Typecheck
npm run typecheck

# Run Vitest test suites
npm test

# Format code with Biome
npm run format:fix
```

## Backend API

By default, the web dashboard expects the Outpipe API server (`outpipe-core`) running locally at `http://localhost:8080`.

## License

AGPL-3.0-or-later

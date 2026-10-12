# Contributing to Outpipe Frontend

Contributions are welcome for the dashboard, desktop client, status pages, secrets share app, and documentation.

## Prerequisites

- Node.js 24 or newer
- npm 10 or newer
- Rust stable and system webkit/build libraries (for Tauri desktop app development)

## Development setup

Clone the repository and install dependencies:

```sh
npm install
```

Start the local development environments:

```sh
# Start all web apps concurrently
npm run dev

# Or start specific applications
npm run dev:web
npm run dev:status
npm run dev:secrets-share
npm run dev:docs
npm run dev:desktop
```

## Quality and verification

Run format, typecheck, and test suites:

```sh
npm run format:fix
npm run typecheck
npm test
npm run test:product-contracts
```

## Pull request guidelines

- Keep PRs focused on a single feature, bug fix, or visual update.
- Ensure all type checks and test suites pass locally before submitting.
- Avoid committing secrets, production API keys, or private tunnel identifiers.
- Format all modified files with Biome (`npm run format:fix`).

# Frontend AI Starter Recipes

[![CI](https://github.com/JeelVankhede/frontend-ai-starter-recipes/actions/workflows/ci.yml/badge.svg)](https://github.com/JeelVankhede/frontend-ai-starter-recipes/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/frontend-ai-starter-recipes.svg)](https://www.npmjs.com/package/frontend-ai-starter-recipes)
[![Node.js](https://img.shields.io/node/v/frontend-ai-starter-recipes)](https://github.com/JeelVankhede/frontend-ai-starter-recipes/blob/main/package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/JeelVankhede/frontend-ai-starter-recipes/blob/main/LICENSE)

Generate opinionated, customized AI agent instructions and workflows for your **frontend** web projects (React, Vue, Svelte, Angular, and common meta-frameworks).

**Package:** [`frontend-ai-starter-recipes`](https://www.npmjs.com/package/frontend-ai-starter-recipes) on npm. **Short CLI:** `fare` (after global install).

For **Node.js backends**, the companion CLI is [`backend-ai-starter-recipes`](https://www.npmjs.com/package/backend-ai-starter-recipes) (`bare`) — see [backend-ai-starter-recipes](https://github.com/JeelVankhede/backend-ai-starter-recipes).

Requires **Node.js 20+**.

## Quick start

### npx (no install)

```bash
npx frontend-ai-starter-recipes --output ./my-app
```

### Global install (short command `fare`)

```bash
npm install -g frontend-ai-starter-recipes
fare --output ./my-app
```

Both commands accept the same flags (`--output`, `--preset`, etc.).

Answer the prompts to define your UI stack, meta-framework, styling, state, data fetching, testing, and target IDEs. The CLI writes a canonical `.ai/` directory and IDE-specific files (**Cursor**, **Claude Code**, **VS Code Copilot**, **Antigravity**, **Windsurf**).

## Documentation

Full walkthrough (problem → architecture → install → usage → output → workflow) and community guide:

**[jeelvankhede.github.io/frontend-ai-starter-recipes](https://jeelvankhede.github.io/frontend-ai-starter-recipes/)**

## Non-interactive presets

```bash
npx frontend-ai-starter-recipes --preset react-vite-tailwind --output ./out
npx frontend-ai-starter-recipes --preset nextjs-shadcn --output ./out
npx frontend-ai-starter-recipes --preset vue-nuxt-pinia --output ./out
npx frontend-ai-starter-recipes --preset svelte-kit --output ./out
npx frontend-ai-starter-recipes --preset angular-material --output ./out
```

(Use `fare` instead of `npx frontend-ai-starter-recipes` if installed globally.)

## Supported stack (prompts)

- **UI:** React, Vue, Svelte, Angular
- **Meta-frameworks:** Next.js, Nuxt, SvelteKit, Remix, Astro
- **Styling & components:** Tailwind, CSS modules, styled-components, shadcn/ui, MUI, etc.
- **State & data:** common client state and data-fetching patterns
- **Tooling:** Storybook, Vitest/Jest, Playwright/Cypress, monitoring, CI/CD targets

## What gets generated?

- `.ai/AGENT.md` — core AI behavior
- `.ai/lifecycle/` — Think, Plan, Build, Review, Test, Ship, and Reflect workflow contracts
- `.ai/rules/` — architecture, components, styling, routing, state, data fetching, forms, performance, a11y, SEO, testing, errors, security, env, Git, pre-commit, and related topics
- `.ai/skills/` — workflows (plan-review, code-review, qa, ship, document-release, retro, performance-audit, accessibility-audit, component-audit, dependency-audit, …)
- `.ai/context/`, `.ai/tracking/` — reference (e.g. domain map, tech stack) and efficiency tracking
- Plus adapters for each selected IDE (Cursor, Claude Code, Copilot, Antigravity, Windsurf)

## Development

```bash
git clone https://github.com/JeelVankhede/frontend-ai-starter-recipes.git
cd frontend-ai-starter-recipes
npm ci
npm run build   # CLI; use dist/cli.js after build
npm test        # Vitest
npm run test:coverage
node dist/cli.js --help
```

Docs site locally: `npm run docs:dev`

## Repository & contributing

- Source: [github.com/JeelVankhede/frontend-ai-starter-recipes](https://github.com/JeelVankhede/frontend-ai-starter-recipes)
- See [CONTRIBUTING.md](CONTRIBUTING.md) for branches, PRs, branch protection, and releases (manual workflow, npm Trusted Publishing / OIDC).

## Security

Report vulnerabilities via [GitHub Security Advisories](https://github.com/JeelVankhede/frontend-ai-starter-recipes/security/advisories/new) or see [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).

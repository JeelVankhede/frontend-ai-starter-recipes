# frontend-ai-starter-recipes (FARE)

Interactive CLI that generates **AI agent instructions**, **rules**, **skills**, and **IDE-specific adapters** for **frontend** web projects (React, Vue, Svelte, Angular, and common meta-frameworks).

**Docs:** [jeelvankhede.github.io/frontend-ai-starter-recipes](https://jeelvankhede.github.io/frontend-ai-starter-recipes/)  
**npm:** [`frontend-ai-starter-recipes`](https://www.npmjs.com/package/frontend-ai-starter-recipes) — CLI commands: `fare` or `frontend-ai-starter-recipes`

## Requirements

- **Node.js 20+**

## Quick start

```bash
npx frontend-ai-starter-recipes --output ./my-app
# or
npx fare --output ./my-app
```

### Presets

```bash
npx fare --preset react-vite-tailwind --output ./out
npx fare --preset nextjs-shadcn --output ./out
npx fare --preset vue-nuxt-pinia --output ./out
npx fare --preset svelte-kit --output ./out
npx fare --preset angular-material --output ./out
```

## What you get

- **`.ai/AGENT.md`** — master behavior for agents on this repo  
- **`.ai/rules/*.md`** — 16 topic rules (architecture, components, styling, routing, state, data fetching, forms, performance, a11y, SEO, testing, errors, security, env, Git, pre-commit)  
- **`.ai/skills/*/`** — optional workflows (plan-review, code-review, qa, ship, document-release, retro, performance-audit, accessibility-audit, component-audit, dependency-audit)  
- **`.ai/context/`** — `domain-map.md`, `tech-stack.md` (edit after generation)  
- **`.ai/tracking/efficiency.md`** — refine rules when the model repeats mistakes  
- **IDE outputs** — Cursor (`.cursor/rules`, `.cursor/skills`), Claude Code (`CLAUDE.md`, `.claude/skills`), VS Code Copilot (`.github/copilot-instructions.md`), Antigravity (`.agents/workflows`), Windsurf (`.windsurfrules`)

## Stack coverage (prompts)

UI libraries, meta-frameworks (Next.js, Nuxt, SvelteKit, Remix, Astro), styling, component libraries, state management, data fetching, forms, Storybook, auth models, Vitest/Jest, Playwright/Cypress, monitoring, CI/CD targets.

## Development

```bash
git clone https://github.com/JeelVankhede/frontend-ai-starter-recipes.git
cd frontend-ai-starter-recipes
npm ci
npm run build
npm test
node dist/cli.js --help
```

Docs site locally: `npm run docs:dev`

## License

MIT — see [LICENSE](./LICENSE).

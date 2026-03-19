# Brainstorm v2: Interactive CLI (FARE)

## Stack

- **Handlebars** — templates under `templates/`
- **@inquirer/prompts** — interactive questionnaire
- **Commander** — `--output`, `--preset`
- **chalk** — CLI output
- **tsup** — bundle `src/cli.ts` to ESM

## Prompt dimensions

Project identity, UI framework, meta-framework (filtered by UI), language, styling, component library, state, data fetching, forms, Storybook, auth, unit tests, E2E, monitoring, CI/CD, IDE targets, skills.

## Output

1. Canonical **`.ai/`** tree  
2. **IDE adapters** — Cursor, Claude Code, Copilot, Antigravity, Windsurf  

## Presets

`react-vite-tailwind`, `nextjs-shadcn`, `vue-nuxt-pinia`, `svelte-kit`, `angular-material`

## Implementation notes

- **Smart filtering** — e.g. Pinia only shown for Vue; NgRx for Angular.  
- **16 rules** always emitted; conditionals inside templates per stack.  
- **10 skills** optional via checkbox / preset list.

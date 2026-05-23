# Usage

## Try it in 2 minutes

Run the React/Vite/Tailwind preset into a throwaway folder:

```bash
npx frontend-ai-starter-recipes --preset react-vite-tailwind --output ./my-app
```

Then inspect the generated operating manual:

```text
my-app/
├── .ai/
│   ├── AGENT.md
│   ├── lifecycle/
│   ├── rules/
│   ├── skills/
│   ├── context/
│   └── tracking/
└── .cursor/ or other IDE adapter files
```

Use `fare --preset react-vite-tailwind --output ./my-app` after a global install.

## Interactive mode

Run without flags and answer prompts (project name, UI framework, meta-framework, styling, state, data layer, forms, Storybook, tests, E2E, IDEs, skills).

```bash
npx frontend-ai-starter-recipes --output ./my-repo
```

Use `fare --output ./my-repo` after a global install.

## Preset coverage

| Preset | Stack (summary) |
|--------|------------------|
| `react-vite-tailwind` | React SPA, Vite, Tailwind, shadcn, Zustand, TanStack Query, RHF, Storybook, Vitest, Playwright |
| `nextjs-shadcn` | Next.js, Tailwind, shadcn, Zustand, TanStack Query, RHF, Storybook, Vitest, Playwright |
| `vue-nuxt-pinia` | Vue, Nuxt, Tailwind, PrimeVue, Pinia, TanStack Query, VeeValidate, Storybook, Vitest, Cypress |
| `svelte-kit` | SvelteKit, Tailwind, Svelte stores, Vitest, Playwright |
| `angular-material` | Angular, Angular Material, NgRx, reactive forms, Jest, Cypress |

```bash
npx frontend-ai-starter-recipes --preset react-vite-tailwind --output ./out
```

## Output directory

`--output` can be `.` to generate into the current project root (you will be warned if the directory is not empty).

## Known Limitations

- This is an early community release intended for developer testing and feedback.
- Presets are opinionated starting points, not proof that every team using that stack should follow the same rules.
- Generated `.ai/` content should be reviewed and edited inside your real repo before treating it as authoritative.
- IDE adapters depend on how each AI tool reads repository context; behavior may differ across tool versions.
- The CLI creates AI instructions, lifecycle guidance, rules, skills, context, tracking, and adapter files. It does not scaffold a complete frontend app.

**Next:** [Understanding the output](/guide/5-the-output).

# Usage

## Interactive mode

Run without flags and answer prompts (project name, UI framework, meta-framework, styling, state, data layer, forms, Storybook, tests, E2E, IDEs, skills).

```bash
npx fare --output ./my-repo
```

## Preset mode

| Preset | Stack (summary) |
|--------|------------------|
| `react-vite-tailwind` | React SPA, Vite, Tailwind, shadcn, Zustand, TanStack Query, RHF, Storybook, Vitest, Playwright |
| `nextjs-shadcn` | Next.js, Tailwind, shadcn, Zustand, TanStack Query, RHF, Storybook, Vitest, Playwright |
| `vue-nuxt-pinia` | Vue, Nuxt, Tailwind, PrimeVue, Pinia, TanStack Query, VeeValidate, Storybook, Vitest, Cypress |
| `svelte-kit` | SvelteKit, Tailwind, Svelte stores, Vitest, Playwright |
| `angular-material` | Angular, Angular Material, NgRx, reactive forms, Jest, Cypress |

```bash
npx fare --preset react-vite-tailwind --output ./out
```

## Output directory

`--output` can be `.` to generate into the current project root (you will be warned if the directory is not empty).

**Next:** [Understanding the output](/guide/5-the-output).

# Installation

## Requirements

- **Node.js 20+**
- **npm** (or any client that supports `npx`)

## Install options

::: tip Pick one
Use **npx** for one-off runs, **global install** for the short `fare` command, or **clone** if you contribute to the generator.
:::

::: code-group

```bash [npx]
npx frontend-ai-starter-recipes --help
```

```bash [Global fare]
npm install -g frontend-ai-starter-recipes
fare --help
```

```bash [Clone / dev]
git clone https://github.com/JeelVankhede/frontend-ai-starter-recipes.git
cd frontend-ai-starter-recipes
npm ci
npm run build
node dist/cli.js --help
```

:::

## Verify

```bash
npx frontend-ai-starter-recipes --help
```

You should see `--output` and `--preset`.

::: details Troubleshooting
- **`command not found: fare`** — Install globally or use `npx frontend-ai-starter-recipes`.  
- **Node version** — `node -v` must be 20+.  
:::

**Next:** [Usage](/guide/4-usage).

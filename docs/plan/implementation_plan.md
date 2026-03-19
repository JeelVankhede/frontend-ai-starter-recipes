# Implementation plan — frontend-ai-starter-recipes

## CLI core

| File | Role |
|------|------|
| `src/cli.ts` | Entry, output dir, preset vs prompts, render loop, adapters |
| `src/prompts.ts` | Interactive flow |
| `src/prompt-choices.ts` | Framework-filtered choice lists |
| `src/context-builder.ts` | `UserAnswers` → `TemplateContext` |
| `src/types.ts` | Answer + context types |
| `src/engine.ts` | Handlebars + partials |
| `src/writer.ts` | Write tree under output dir |
| `src/path-utils.ts` | `~` expansion |

## Templates

- **1** `agent.hbs`
- **16** rules under `templates/rules/`
- **10** skills under `templates/skills/` (code-review = skill + checklist)
- **5** partials
- **2** context + **1** tracking

## IDE adapters

`src/adapters/cursor.ts` (frontend-specific globs), `claude-code.ts`, `vscode-copilot.ts`, `antigravity.ts`, `windsurf.ts`

## Presets

Five JSON files under `presets/`.

## Verification

- `npm test` — 100% coverage on included `src` files  
- `npm run test:pack` — packed tarball + `fare --preset nextjs-shadcn`  
- `npm run docs:build` — VitePress site

## Phases (completed in repo scaffold)

1. Repo + infra copy  
2. Types, prompts, context  
3. CLI wiring  
4–7. Templates + skills  
8. Presets + Cursor globs  
9. Tests + root docs + CI  
10. VitePress + planning docs  

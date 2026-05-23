# Understanding the output

## Canonical tree (`.ai/`)

The CLI creates repo instructions and adapter files, not a runnable frontend app. Treat the generated `.ai/` tree as a starting operating manual for your project and edit it after reviewing the output.

```
.ai/
  AGENT.md
  lifecycle/      # Think, Plan, Build, Review, Test, Ship, Reflect
  rules/          # 16 topic markdown files
  skills/         # e.g. plan-review/SKILL.md, code-review/checklist.md
  context/
    domain-map.md
    tech-stack.md
  tracking/
    efficiency.md
```

## Rules (topics)

Includes architecture, component-patterns, styling, routing, state-management, data-fetching, forms-validation, performance, accessibility, seo-meta, testing, errors-logging, security, environment, git-conventions, pre-commit.

## Lifecycle

Lifecycle files live under `.ai/lifecycle/`:

- `think.md` — understand goal, stack, constraints, and existing code before planning
- `plan.md` — name affected routes, components, state/data boundaries, risks, and tests
- `build.md` — implement only the approved frontend scope
- `review.md` — check correctness, accessibility, performance, maintainability, and adapter output
- `test.md` — run or define validation proportional to risk
- `ship.md` — summarize changes, validation, release notes, and rollback notes
- `reflect.md` — capture template gaps and follow-up tasks

## Cursor

- `.cursor/rules/index.mdc` — master instructions (`alwaysApply`)  
- `.cursor/rules/lifecycle.mdc` — lifecycle workflow contract
- `.cursor/rules/<rule>.mdc` — per-rule `globs` where relevant (e.g. `component-patterns`, `testing`)  
- `.cursor/skills/<skill>/` — copied skill files  

## Claude Code / Copilot / Windsurf

Merged markdown (`CLAUDE.md`, `.github/copilot-instructions.md`, `.windsurfrules`) includes `AGENT.md`, lifecycle files, and rules. Claude skill folders are copied when applicable.

## Antigravity

`.agents/workflows/<skill>.md` from each `SKILL.md`.

**Next:** [Recommended workflow](/guide/6-workflow).

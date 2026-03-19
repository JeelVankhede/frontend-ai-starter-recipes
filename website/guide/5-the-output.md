# Understanding the output

## Canonical tree (`.ai/`)

```
.ai/
  AGENT.md
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

## Cursor

- `.cursor/rules/index.mdc` — master instructions (`alwaysApply`)  
- `.cursor/rules/<rule>.mdc` — per-rule `globs` where relevant (e.g. `component-patterns`, `testing`)  
- `.cursor/skills/<skill>/` — copied skill files  

## Claude Code / Copilot / Windsurf

Merged markdown (`CLAUDE.md`, `.github/copilot-instructions.md`, `.windsurfrules`) plus Claude skill folders when applicable.

## Antigravity

`.agents/workflows/<skill>.md` from each `SKILL.md`.

**Next:** [Recommended workflow](/guide/6-workflow).

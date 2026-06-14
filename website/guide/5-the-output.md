# Understanding the output

## Generated output by adapter

The CLI creates repo instructions and adapter files, not a runnable frontend app.
Files are written directly to each IDE's native paths — no `.ai/` intermediate directory is created.

| Adapter | What gets written |
| --- | --- |
| **Cursor** | `.cursor/rules/index.mdc` (agent + context) · `.cursor/rules/<rule>.mdc` (13 rules, per-rule globs) · `.cursor/skills/<stage>/SKILL.md` (7 lifecycle stages) |
| **Claude Code** | `.claude/rules/<rule>.md` (13 rules) · `.claude/commands/<stage>.md` (7 lifecycle stages) · `CLAUDE.md` (load-when pointer index) |
| **VS Code Copilot** | `.github/copilot-instructions.md` (agent + all rules + all lifecycle stages merged into one file) |
| **Windsurf** | `.windsurf/rules/<rule>.md` (13 rules) · `.windsurf/rules/lifecycle-<stage>.md` (7 stages) · `.windsurfrules` (agent + context) |
| **Antigravity** | `.agents/workflows/<stage>.md` (7 lifecycle stages) |

Select one or more adapters during the interactive prompt. Only the files for selected adapters are written.

## Rules (topics)

13 rule files covering: architecture, components, styling-accessibility, routing, state-and-data-fetching, forms-validation, performance-and-testing, seo-meta, errors-logging, security, environment, git-conventions, pre-commit.

## Lifecycle

The 7 lifecycle stages are written in adapter-native paths (see table above):

- **think** — understand goal, stack, constraints, and existing code before planning
- **plan** — name affected routes, components, state/data boundaries, risks, and tests
- **build** — implement only the approved frontend scope
- **review** — check correctness, accessibility, performance, maintainability
- **test** — run or define validation proportional to risk
- **ship** — summarize changes, validation, release notes, and rollback notes
- **reflect** — capture template gaps and follow-up tasks

## Cursor

- `.cursor/rules/index.mdc` — agent identity + project context (`alwaysApply: true`)
- `.cursor/rules/<rule>.mdc` — per-rule file with `globs` where relevant (e.g. `components`, `forms-validation`)
- `.cursor/skills/<stage>/SKILL.md` — lifecycle stage invoked via `/think`, `/plan`, etc.

## Claude Code

- `.claude/rules/<rule>.md` — per-rule file (loaded on demand)
- `.claude/commands/<stage>.md` — lifecycle stage invoked from the command palette
- `CLAUDE.md` — slim pointer index listing all rules and lifecycle commands with `load-when` paths

## VS Code Copilot

`.github/copilot-instructions.md` — single merged file with agent instructions, all rules, and all lifecycle sections. Reference sections by name in Copilot chat.

## Windsurf

- `.windsurfrules` — agent + context (always-on)
- `.windsurf/rules/<rule>.md` — per-rule files
- `.windsurf/rules/lifecycle-<stage>.md` — per-stage lifecycle files

## Antigravity

`.agents/workflows/<stage>.md` — one workflow file per lifecycle stage (7 total).

**Next:** [Recommended workflow](/guide/6-workflow).

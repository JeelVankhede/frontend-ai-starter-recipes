# Understanding the output

## What gets generated

The CLI writes adapter-native files directly into your project. You get only the files for the IDEs you selected — nothing else is created.

Commit these files like any other project config. The CLI creates AI instructions and adapter files, not runnable application code. Review and edit the generated content before treating it as authoritative.

| Adapter | What gets written |
| --- | --- |
| **Cursor** | `.cursor/rules/index.mdc` (agent + context) · `.cursor/rules/<rule>.mdc` (13 rules, per-rule globs) · `.cursor/skills/<stage>/SKILL.md` (7 lifecycle stages) |
| **Claude Code** | `.claude/rules/<rule>.md` (13 rules) · `.claude/commands/<stage>.md` (7 lifecycle stages) · `CLAUDE.md` (load-when pointer index) |
| **VS Code Copilot** | `.github/copilot-instructions.md` (agent + all rules + all lifecycle stages merged into one file) |
| **Windsurf** | `.windsurf/rules/<rule>.md` (13 rules) · `.windsurf/rules/lifecycle-<stage>.md` (7 stages) · `.windsurfrules` (agent + context) |
| **Antigravity** | `.agents/workflows/<stage>.md` (7 lifecycle stages) |

Select one or more adapters during the interactive prompt. Only the files for selected adapters are written.

## Rules

| Rule file | What it controls |
| --- | --- |
| `architecture.md` | Component layout, rendering strategy, domain structure |
| `components.md` | Component design, props contracts, composition patterns |
| `styling-accessibility.md` | Styling approach, a11y requirements, keyboard/focus |
| `state-and-data-fetching.md` | State strategy, query patterns, cache policy |
| `routing.md` | Route structure, navigation, meta-framework conventions |
| `forms-validation.md` | Form strategy, validation, submission patterns |
| `performance-and-testing.md` | CWV, bundle size, testing strategy and framework idioms |
| `errors-logging.md` | Error handling, logging, observability |
| `security.md` | Auth, CSRF, secrets handling |
| `seo-meta.md` | Meta tags, structured data, SSR/SSG conventions |
| `environment.md` | Config, env files, CI flags |
| `git-conventions.md` | Branches, commits, PR scope |
| `pre-commit.md` | Build / lint / test gates before commit |

## Lifecycle stages

The 7 lifecycle stages are written in adapter-native paths (see table above):

- **think** — understand goal, stack, constraints, and existing code before planning
- **plan** — name affected routes, components, state/data boundaries, risks, and tests
- **build** — implement only the approved frontend scope
- **review** — check correctness, accessibility, performance, maintainability
- **test** — run or define validation proportional to risk
- **ship** — summarize changes, validation, release notes, and rollback notes
- **reflect** — capture template gaps and follow-up tasks

## Per-adapter output

### Cursor

```
.cursor/rules/index.mdc           # agent identity + context (alwaysApply: true)
.cursor/rules/<rule>.mdc          # one file per rule, globs where relevant
.cursor/skills/think/
.cursor/skills/plan/
.cursor/skills/build/
.cursor/skills/review/
.cursor/skills/test/
.cursor/skills/ship/
.cursor/skills/reflect/
```

### Claude Code

```
CLAUDE.md                         # slim pointer index — lists all rules and commands with load-when paths
.claude/rules/<rule>.md           # one file per rule (loaded on demand)
.claude/commands/think.md
.claude/commands/plan.md
.claude/commands/build.md
.claude/commands/review.md
.claude/commands/test.md
.claude/commands/ship.md
.claude/commands/reflect.md
```

### VS Code Copilot

```
.github/copilot-instructions.md   # agent identity + all rules + all lifecycle stages merged
```

### Windsurf

```
.windsurfrules                         # agent identity (slim, always-on)
.windsurf/rules/<rule>.md              # one file per rule
.windsurf/rules/lifecycle-think.md
.windsurf/rules/lifecycle-plan.md
.windsurf/rules/lifecycle-build.md
.windsurf/rules/lifecycle-review.md
.windsurf/rules/lifecycle-test.md
.windsurf/rules/lifecycle-ship.md
.windsurf/rules/lifecycle-reflect.md
```

### Antigravity

```
.agents/workflows/think.md
.agents/workflows/plan.md
.agents/workflows/build.md
.agents/workflows/review.md
.agents/workflows/test.md
.agents/workflows/ship.md
.agents/workflows/reflect.md
```

**Next:** [Recommended workflow](/guide/6-workflow).

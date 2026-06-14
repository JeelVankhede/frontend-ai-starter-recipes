# Lifecycle in practice

> Introduced in Fare v1.2

This page walks through a real task end-to-end using the 7-stage Fare lifecycle. Every stage is **user-invoked** — the CLI generates the lifecycle files; you decide when to use them with your AI tool.

**Task:** Adding a dashboard page to a React/Next.js project.  
**Stack:** Next.js 14, React, Tailwind CSS, TanStack Query, shadcn/ui.  
**IDE used in examples:** Cursor (adapt invocations for your tool — see each stage).

---

## 1. Task setup

You have a Next.js app with authentication and a data API. The product team wants a `/dashboard` route showing a summary card grid with live data. You open your project in Cursor.

The generated lifecycle files sit in adapter-native paths. In Cursor they are at `.cursor/skills/think/SKILL.md`, `.cursor/skills/plan/SKILL.md`, and so on.

---

## 2. Think

**Goal:** Understand the task, the affected code surfaces, and any constraints before touching a line.

**How to invoke:**

- **Cursor:** type `/think` in Agent chat.
- **Claude Code:** run `/think` from the command palette.
- **Copilot:** open `copilot-instructions.md` and reference the `## Lifecycle: Think` section.
- **Windsurf:** the Think stage is in `.windsurf/rules/lifecycle-think.md`.
- **Antigravity:** open `.agents/workflows/think.md`.

**What the AI does at this stage:**

> Example AI output:
>
> ```
> Goal: add /dashboard page with summary card grid.
> Affected surfaces: app/dashboard/page.tsx (new), components/cards/ (new),
>   lib/queries/dashboard.ts (new TanStack Query hook), middleware.ts (auth guard).
> Constraints: card data from /api/metrics — paginated, 200ms SLA.
>   No changes to auth flow. shadcn Card component already installed.
> Open questions: should cards be server-rendered or client-fetched?
>   Proposal: server component shell, client component for live refresh.
> ```

The AI lists what it will touch, flags constraints, and surfaces open questions **before** writing code. You review and correct any misunderstandings.

---

## 3. Plan

**Goal:** Produce a concrete implementation plan with affected files, component boundaries, and risk callouts.

**How to invoke:**

- **Cursor:** type `/plan` in Agent chat.
- **Claude Code:** run `/plan` from the command palette.
- **Copilot:** reference the `## Lifecycle: Plan` section in `copilot-instructions.md`.
- **Windsurf:** `.windsurf/rules/lifecycle-plan.md`.
- **Antigravity:** `.agents/workflows/plan.md`.

**What the AI produces:**

> Example AI output:
>
> ```
> Plan: Dashboard page — React/Next.js
>
> Files to create:
>   app/dashboard/page.tsx        — server component; fetches initial metrics
>   app/dashboard/loading.tsx     — Suspense fallback skeleton
>   components/cards/MetricCard.tsx  — shadcn Card wrapper with live-refresh
>   lib/queries/dashboard.ts      — useMetrics() TanStack Query hook
>
> Files to modify:
>   middleware.ts                 — add /dashboard to protected routes
>   app/layout.tsx                — add dashboard link to nav
>
> Risks:
>   - /api/metrics pagination not yet implemented — stub with page=1 for now
>   - MetricCard live refresh may cause layout shift on data update — pin card height
>
> Tests: Vitest unit test for useMetrics hook; Playwright e2e for /dashboard route guard.
> ```

You review the plan, correct scope, and give the go-ahead.

---

## 4. Build → Test → Ship (summarized)

With an approved plan, you invoke each stage in turn:

- **`/build`** — AI implements only the scoped files. You review diffs as it works.
- **`/review`** — AI checks correctness, accessibility (WCAG contrast on cards, keyboard nav), and performance (no client waterfalls).
- **`/test`** — AI runs `vitest run` and `playwright test --grep dashboard`; reports coverage gaps.
- **`/ship`** — AI writes a commit message, lists changed files, and drafts a PR description with rollback notes.

Each invocation is a discrete, user-triggered action.

---

## 5. Reflect

**Goal:** Capture what the lifecycle revealed — gaps in rules, follow-up tasks, template improvements.

**How to invoke:**

- **Cursor:** type `/reflect` in Agent chat.
- **Claude Code:** run `/reflect` from the command palette.
- **Copilot:** reference the `## Lifecycle: Reflect` section.
- **Windsurf:** `.windsurf/rules/lifecycle-reflect.md`.
- **Antigravity:** `.agents/workflows/reflect.md`.

**Example gap captured:**

> AI noted: no rule covers error boundary placement for async data-fetching components. During Build, it added a generic `<ErrorBoundary>` but flagged that the project has no standard for where boundaries should live relative to Suspense. Logged as a backlog item: "Add error boundary placement rule to `components.mdc`."

This is the reflect loop in action — the lifecycle surfaces a real gap in the AI's operating instructions and gives you a concrete item to close.

---

## Key principles

1. **Every stage is user-invoked.** The CLI generates the lifecycle files; it does not run them or chain them automatically.
2. **You stay in control.** Review the Think output before letting the AI plan. Review the plan before letting it build.
3. **The lifecycle is not a script.** Skip stages that don't apply (e.g. `/review` before a trivial one-line change).
4. **Reflect closes the loop.** Gaps found during a task become rule improvements for the next task.

---

**Next:** [Recommended workflow](/guide/6-workflow) · [Understanding the output](/guide/5-the-output)

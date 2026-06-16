# The problem

You open Cursor, Claude Code, or Copilot and explain — again — that you use **React** not Vue, **Next.js App Router** not Pages, **Zustand** not Redux, **Tailwind** not styled-components, and that **Playwright** is the E2E runner.

That friction is **missing shared context**. General models do not ship with *your* component library, *your* route layout, or *your* definition of “done” for accessibility.

## Before FARE

::: info Typical loop
- Re-state stack and UI conventions every session  
- Inconsistent patterns across features  
- Reviews catch “wrong framework idioms” instead of product risk  
- No shared checklist for Lighthouse, axe, or bundle impact  
:::

## After FARE

::: tip What changes
- **Rules** encode structure, styling, state, data, forms, a11y, SEO, testing, and security — once.  
- **Skills** encode workflows (plan → review → QA → ship → audits).  
- **Context** files anchor the agent to *this* product and approved libraries.  
:::

## What you generate (at a glance)

| Piece | Role |
|-------|------|
| **Agent file** | Core identity, quality gates, and principles for your repo |
| **Rules** (13 files) | Always-on standards — architecture, components, styling, state, routing, testing, security, and more |
| **Lifecycle stages** | Seven named workflows — Think, Plan, Build, Review, Test, Ship, Reflect |
| **Context** | Domain map and approved tech stack you fill in once |
| **IDE format** | Delivered as Cursor `.mdc` rules, `CLAUDE.md`, Copilot instructions, Windsurf rules, or Antigravity workflows |

**Next:** [How it works](/guide/2-how-it-works).

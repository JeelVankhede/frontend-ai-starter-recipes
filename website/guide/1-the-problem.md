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
| `.ai/AGENT.md` | Core behavior for this frontend repo |
| `.ai/rules/*.md` | Topic standards (16 files) |
| `.ai/skills/*/` | Named workflows |
| `.ai/context/` | Domain map + tech stack |
| IDE adapters | Cursor, Claude, Copilot, Antigravity, Windsurf |

**Next:** [How it works](/guide/2-how-it-works).

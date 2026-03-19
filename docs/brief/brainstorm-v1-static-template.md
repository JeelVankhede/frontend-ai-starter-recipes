# Brainstorm v1: Static frontend AI template

## Idea

Ship a fixed set of Markdown files (`.ai/AGENT.md`, rules for React, Vue, etc.) that teams copy into every frontend repo.

## Problem

One-size-fits-all content assumes a single stack (e.g. Next + Tailwind + Zustand). Teams on Nuxt, SvelteKit, or Angular would rewrite most files — high friction and stale guidance.

## Pivot

Interactive CLI + **Handlebars** templates, driven by **presets** and **prompts**, mirroring the backend **BARE** approach but with frontend-native dimensions (UI library, meta-framework, styling, state, data fetching, forms, E2E, Storybook).

# Changelog

All notable changes to this project are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.2.0] - 2026-06-14

### Changed

- **Adapter-first output**: the CLI no longer writes a `.ai/` intermediate directory. Rules, lifecycle files, and agent instructions are written directly to each IDE's native paths (Cursor, Claude Code, VS Code Copilot, Windsurf, Antigravity).
- **Acronym expansion**: "Fare — **F**rontend **A**i starter **RE**cipes" surfaced at every first-contact surface — package description, README, CLI startup banner, VitePress docs title, and generated agent content.
- Rule set consolidated from 16 rules to 13 (3 folds: styling + accessibility → `styling-accessibility`; state + data-fetching → `state-and-data-fetching`; performance + testing → `performance-and-testing`). Renamed `component-patterns` → `components`.
- Lifecycle files updated from v1.2 blueprints; `.ai/` path references removed from template bodies.

### Added

- `--write-mode <backup|skip-existing|overwrite>` flag for safe re-runs (default: `backup`). Re-running backs up existing files to `<file>.fare-backup`.
- Boxed startup banner on every invocation showing version and docs URL (`src/banner.ts`).
- Structured post-generation summary: per-adapter file groups, totals line, and IDE-keyed "Next steps" block.
- Lifecycle demo page in the VitePress guide: concrete worked example (Think → Reflect) for adding a dashboard page to a React/Next.js project.
- v1.1 docs accessible at `/v1.1/` for consumers who need the previous reference.
- Version switcher in the docs site nav.

### Removed

- `.ai/` intermediate directory from all CLI output.
- Standalone skill templates (11 files in `templates/skills/`).

## [1.1.0] - prior

### Added

- Initial release of the Fare CLI with `.ai/` canonical output tree (AGENT.md, lifecycle/, rules/, skills/, context/, tracking/).
- 5-adapter support: Cursor, Claude Code, VS Code Copilot, Windsurf, Antigravity.
- Initial preset library: `react-vite-tailwind`, `nextjs-shadcn`, `vue-nuxt-pinia`, `svelte-kit`, `angular-material`.

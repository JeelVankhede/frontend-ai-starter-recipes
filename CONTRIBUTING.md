# Contributing

Thanks for helping improve **frontend-ai-starter-recipes** (FARE).

## Branching

- **`main`** — release-ready code only.
- **Feature branches:** `feature/short-description`
- **Fix branches:** `fix/issue-or-topic`

Fork the repo, branch from `main`, then open a **Pull Request** against `main`.

## Before you open a PR

1. Run **`npm run build`** and **`npm run test:coverage`** (or `npm test`).
2. If you touch **`website/`**, run **`npm run docs:build`** (also runs in CI).
3. If you change user-facing behavior, update **README.md** as needed.
4. Add or extend **JSDoc** on exported functions and non-obvious logic in `src/`.

## Commit messages

Clear, imperative messages are enough (optional: [Conventional Commits](https://www.conventionalcommits.org/)).

## Protecting `main` (maintainers)

- Require PRs and status checks before merging to `main`.
- Allow automation bypass for [`.github/workflows/release.yml`](.github/workflows/release.yml) if branch protection blocks version bump pushes.

## Releases (maintainers)

Publishing via **Actions → Release** ([`release.yml`](.github/workflows/release.yml)): **npm Trusted Publishing (OIDC)** — see [npm docs](https://docs.npmjs.com/trusted-publishers).

---

## Testing docs locally

### Single version

```bash
cd website && npm run docs:dev
```

Docs run at http://localhost:5173. The version switcher in the nav is non-functional locally — it targets deployed GitHub Pages paths.

### Side-by-side version comparison (v1.1 vs v1.2)

Use `git worktree` to check out both versions simultaneously without cloning twice:

```bash
# From the repo root
git worktree add ../fare-v1.1 v1.1.0

# Terminal 1 — v1.1
cd ../fare-v1.1/website && npm install && npm run docs:dev -- --port 5174

# Terminal 2 — v1.2 (release branch)
cd <repo>/website && npm run docs:dev -- --port 5173
```

Open http://localhost:5173 (v1.2) and http://localhost:5174 (v1.1) side by side.

Clean up the worktree when done:

```bash
git worktree remove ../fare-v1.1
```

---

## Questions

Open an [issue](https://github.com/JeelVankhede/frontend-ai-starter-recipes/issues) on GitHub.

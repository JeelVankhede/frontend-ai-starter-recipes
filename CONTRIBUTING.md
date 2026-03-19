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

## Questions

Open an [issue](https://github.com/JeelVankhede/frontend-ai-starter-recipes/issues) on GitHub.

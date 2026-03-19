# Releasing

1. Ensure **`main`** is green (CI).
2. In GitHub: **Actions → Release → Run workflow** → choose **patch** / **minor** / **major**.
3. The workflow bumps `package.json`, tags `v*`, publishes to npm (OIDC), and creates a GitHub Release.

Local smoke check before release:

```bash
npm run build && npm pack && node scripts/test-pack.js
```

## First-time npm setup

- npm account with 2FA
- Package linked to this repo as a **trusted publisher** on npm

#!/usr/bin/env node
/**
 * Installs the packed tarball and runs npx fare --preset nextjs-shadcn --output ./out.
 */
import { readdirSync, mkdtempSync, existsSync, rmSync } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

import { statSync } from 'fs';
const tgzFiles = readdirSync(repoRoot).filter(
  (f) => f.startsWith('frontend-ai-starter-recipes-') && f.endsWith('.tgz'),
);
if (tgzFiles.length === 0) {
  console.error('No frontend-ai-starter-recipes-*.tgz found. Run: npm run build && npm pack');
  process.exit(1);
}
// Use the most recently created tarball (in case stale older versions exist).
tgzFiles.sort((a, b) => statSync(path.join(repoRoot, b)).mtimeMs - statSync(path.join(repoRoot, a)).mtimeMs);
const tarballPath = path.join(repoRoot, tgzFiles[0]);

const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'fare-pack-'));
try {
  execSync('npm init -y', { cwd: tmpDir, stdio: 'pipe' });
  execSync(`npm install "${tarballPath}"`, { cwd: tmpDir, stdio: 'inherit' });
  execSync('npx fare --help', { cwd: tmpDir, stdio: 'inherit' });
  execSync('npx fare --preset nextjs-shadcn --output ./out', {
    cwd: tmpDir,
    stdio: 'inherit',
    env: { ...process.env, CI: '1' },
    timeout: 120000,
  });
  // v1.2: no .ai/ intermediate tree. The nextjs-shadcn preset selects cursor,
  // claude-code, and vscode-copilot adapters; we sanity-check one file per
  // selected adapter to confirm the in-memory render → adapter pipeline ran.
  const cursorIndexPath = path.join(tmpDir, 'out', '.cursor', 'rules', 'index.mdc');
  if (!existsSync(cursorIndexPath)) {
    console.error('Expected out/.cursor/rules/index.mdc not found after preset run');
    process.exit(1);
  }
  const claudeMdPath = path.join(tmpDir, 'out', 'CLAUDE.md');
  if (!existsSync(claudeMdPath)) {
    console.error('Expected out/CLAUDE.md not found after preset run');
    process.exit(1);
  }
  const copilotPath = path.join(tmpDir, 'out', '.github', 'copilot-instructions.md');
  if (!existsSync(copilotPath)) {
    console.error('Expected out/.github/copilot-instructions.md not found after preset run');
    process.exit(1);
  }
  const aiDirPath = path.join(tmpDir, 'out', '.ai');
  if (existsSync(aiDirPath)) {
    console.error('Unexpected out/.ai/ directory present in v1.2 output');
    process.exit(1);
  }
  console.log('test:pack passed.');
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}

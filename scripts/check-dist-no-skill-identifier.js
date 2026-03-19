#!/usr/bin/env node
/**
 * Verifies dist/cli.js does not contain a reference to undefined variable SKILL.
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const distPath = path.join(repoRoot, 'dist', 'cli.js');

let content;
try {
  content = readFileSync(distPath, 'utf8');
} catch (e) {
  console.error('scripts/check-dist-no-skill-identifier.js: dist/cli.js not found. Run npm run build first.');
  process.exit(1);
}

if (/\$\{SKILL\}/.test(content)) {
  console.error('dist/cli.js contains ${SKILL} (undefined variable). Fix template literals.');
  process.exit(1);
}

if (/SKILL(?!\.md|_)/.test(content)) {
  console.error('dist/cli.js contains bare SKILL identifier. Use SKILL_FILENAME or string "SKILL.md".');
  process.exit(1);
}

console.log('dist/cli.js: no dangerous SKILL reference found.');

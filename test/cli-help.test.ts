import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync } from 'fs';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliJs = path.join(root, 'dist', 'cli.js');

describe('CLI --help', () => {
  beforeAll(() => {
    if (!existsSync(cliJs)) {
      execSync('npm run build', { cwd: root, stdio: 'pipe' });
    }
  });

  it('exits 0 and prints usage', () => {
    const r = spawnSync(process.execPath, [cliJs, '--help'], {
      cwd: root,
      encoding: 'utf-8',
    });
    expect(r.status).toBe(0);
    const out = `${r.stdout}${r.stderr}`;
    expect(out).toMatch(/output|preset|--help/i);
    expect(out).toMatch(/frontend-ai-starter-recipes|Generate/i);
  });
});

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync } from 'fs';
import { spawnSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { execSync } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliJs = path.join(root, 'dist', 'cli.js');

describe('CLI preset e2e', () => {
  beforeAll(() => {
    if (!existsSync(cliJs)) {
      execSync('npm run build', { cwd: root, stdio: 'pipe' });
    }
  });

  // All 5 adapters × ~60 files × 500ms sleep = ~30s. Timeout set to 120s.
  it('generates v1.2 adapter output with react-vite-tailwind preset (no .ai/ tree)', async () => {
    const out = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-e2e-'));
    const r = spawnSync(
      process.execPath,
      [cliJs, '--preset', 'react-vite-tailwind', '--output', out],
      {
        cwd: root,
        encoding: 'utf-8',
        env: { ...process.env, CI: '1' },
        timeout: 120000,
      },
    );
    expect(r.status).toBe(0);
    // v1.2 contract: no .ai/ intermediate tree on disk.
    expect(existsSync(path.join(out, '.ai'))).toBe(false);
    // react-vite-tailwind preset selects all 5 adapters.
    const cursorIndex = await fs.readFile(path.join(out, '.cursor', 'rules', 'index.mdc'), 'utf-8');
    expect(cursorIndex.length).toBeGreaterThan(100);
    expect(cursorIndex).toMatch(/react|React|Vite|vite/i);
    const claudeMd = await fs.readFile(path.join(out, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toMatch(/react|React|Vite|vite/i);
    const thinkCommand = await fs.readFile(path.join(out, '.claude', 'commands', 'think.md'), 'utf-8');
    const reflectCommand = await fs.readFile(path.join(out, '.claude', 'commands', 'reflect.md'), 'utf-8');
    expect(thinkCommand).toMatch(/Think/);
    expect(reflectCommand).toMatch(/Reflect/);
  }, 120000);

  it('exits non-zero for missing preset', () => {
    const r = spawnSync(
      process.execPath,
      [cliJs, '--preset', 'preset-does-not-exist-xyz', '--output', '/tmp'],
      {
        cwd: root,
        encoding: 'utf-8',
      },
    );
    expect(r.status).toBe(1);
    expect(`${r.stdout}${r.stderr}`).toMatch(/could not load|preset/i);
  });
});

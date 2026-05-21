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

  it('generates .ai/AGENT.md with react-vite-tailwind preset', async () => {
    const out = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-e2e-'));
    const r = spawnSync(
      process.execPath,
      [cliJs, '--preset', 'react-vite-tailwind', '--output', out],
      {
        cwd: root,
        encoding: 'utf-8',
        env: { ...process.env, CI: '1' },
      },
    );
    expect(r.status).toBe(0);
    const agent = await fs.readFile(path.join(out, '.ai', 'AGENT.md'), 'utf-8');
    expect(agent.length).toBeGreaterThan(100);
    expect(agent).toMatch(/react|React|Vite|vite/i);
    const think = await fs.readFile(path.join(out, '.ai', 'lifecycle', 'think.md'), 'utf-8');
    const reflect = await fs.readFile(path.join(out, '.ai', 'lifecycle', 'reflect.md'), 'utf-8');
    expect(think).toMatch(/Think/);
    expect(reflect).toMatch(/Reflect/);
  });

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

import { describe, it, expect, vi } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { FileWriter } from './writer.js';

const SUFFIX = '.fare-backup';

describe('FileWriter', () => {
  it('creates nested file with trimmed body and trailing newline', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-writer-'));
    const writer = new FileWriter(tmp);
    await writer.write('nested/deep/file.md', '  hello world  ');
    const full = path.join(tmp, 'nested/deep/file.md');
    const content = await fs.readFile(full, 'utf-8');
    expect(content).toBe('hello world\n');
  });

  it('write returns WriteResult { path, status: created } for new file in default backup mode', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-writer-result-'));
    const writer = new FileWriter(tmp, 'backup', SUFFIX);
    const result = await writer.write('out/r.md', 'x');
    expect(result).toEqual({ path: 'out/r.md', status: 'created' });
  });

  it('ensureCleanOutputDir removes directory', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-clean-'));
    await fs.mkdir(path.join(tmp, 'out/rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, 'out/rules/x.md'), 'x');
    const writer = new FileWriter(tmp);
    await writer.ensureCleanOutputDir('out');
    await expect(fs.access(path.join(tmp, 'out'))).rejects.toThrow();
  });

  it('ensureCleanOutputDir swallows rm errors', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-clean-err-'));
    const writer = new FileWriter(tmp);
    const rm = vi.spyOn(fs, 'rm').mockRejectedValueOnce(new Error('EBUSY'));
    await expect(writer.ensureCleanOutputDir('out')).resolves.toBeUndefined();
    rm.mockRestore();
  });

  describe('backup mode', () => {
    it('writes new file → status: created', async () => {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-bk-new-'));
      const writer = new FileWriter(tmp, 'backup', SUFFIX);
      const result = await writer.write('a.md', 'first');
      expect(result.status).toBe('created');
      expect(await fs.readFile(path.join(tmp, 'a.md'), 'utf-8')).toBe('first\n');
    });

    it('existing file → copies original to <path><suffix>, writes new, status: backed-up', async () => {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-bk-exists-'));
      await fs.writeFile(path.join(tmp, 'a.md'), 'original');
      const writer = new FileWriter(tmp, 'backup', SUFFIX);
      const result = await writer.write('a.md', 'second');
      expect(result.status).toBe('backed-up');
      expect(await fs.readFile(path.join(tmp, 'a.md'), 'utf-8')).toBe('second\n');
      expect(await fs.readFile(path.join(tmp, `a.md${SUFFIX}`), 'utf-8')).toBe('original');
    });

    it('backup-of-backup: existing file + existing backup → new backup overwrites prior backup (single-slot rotation)', async () => {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-bk-rotate-'));
      // simulate a prior run: existing target + existing backup of an earlier original
      await fs.writeFile(path.join(tmp, 'a.md'), 'run-1-current');
      await fs.writeFile(path.join(tmp, `a.md${SUFFIX}`), 'run-0-original');
      const writer = new FileWriter(tmp, 'backup', SUFFIX);
      const result = await writer.write('a.md', 'run-2-content');
      expect(result.status).toBe('backed-up');
      expect(await fs.readFile(path.join(tmp, 'a.md'), 'utf-8')).toBe('run-2-content\n');
      // backup slot now holds the run-1 content (pre-overwrite original from this run),
      // not the run-0 content from before.
      expect(await fs.readFile(path.join(tmp, `a.md${SUFFIX}`), 'utf-8')).toBe('run-1-current');
    });
  });

  describe('skip-existing mode', () => {
    it('new file → writes and returns created', async () => {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-skip-new-'));
      const writer = new FileWriter(tmp, 'skip-existing', SUFFIX);
      const result = await writer.write('a.md', 'first');
      expect(result.status).toBe('created');
      expect(await fs.readFile(path.join(tmp, 'a.md'), 'utf-8')).toBe('first\n');
    });

    it('existing file → no write, no backup, status: skipped', async () => {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-skip-exists-'));
      await fs.writeFile(path.join(tmp, 'a.md'), 'original');
      const writer = new FileWriter(tmp, 'skip-existing', SUFFIX);
      const result = await writer.write('a.md', 'second');
      expect(result.status).toBe('skipped');
      expect(await fs.readFile(path.join(tmp, 'a.md'), 'utf-8')).toBe('original');
      await expect(fs.access(path.join(tmp, `a.md${SUFFIX}`))).rejects.toThrow();
    });
  });

  describe('overwrite mode', () => {
    it('new file → writes and returns created', async () => {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-ow-new-'));
      const writer = new FileWriter(tmp, 'overwrite', SUFFIX);
      const result = await writer.write('a.md', 'first');
      expect(result.status).toBe('created');
      expect(await fs.readFile(path.join(tmp, 'a.md'), 'utf-8')).toBe('first\n');
    });

    it('existing file → writes without backup, status: overwritten', async () => {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-ow-exists-'));
      await fs.writeFile(path.join(tmp, 'a.md'), 'original');
      const writer = new FileWriter(tmp, 'overwrite', SUFFIX);
      const result = await writer.write('a.md', 'second');
      expect(result.status).toBe('overwritten');
      expect(await fs.readFile(path.join(tmp, 'a.md'), 'utf-8')).toBe('second\n');
      await expect(fs.access(path.join(tmp, `a.md${SUFFIX}`))).rejects.toThrow();
    });
  });
});

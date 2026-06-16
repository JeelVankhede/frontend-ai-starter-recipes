/**
 * Unit tests for CLI write-mode prompt logic and TTY guard.
 * Tests the condition: prompt shows when --write-mode not passed AND stdin is a TTY.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  confirm: vi.fn(),
  select: vi.fn(),
  checkbox: vi.fn(),
}));

import { select } from '@inquirer/prompts';

describe('write-mode prompt condition', () => {
  let originalIsTTY: boolean | undefined;

  beforeEach(() => {
    originalIsTTY = process.stdin.isTTY;
    vi.mocked(select).mockReset();
  });

  afterEach(() => {
    Object.defineProperty(process.stdin, 'isTTY', {
      value: originalIsTTY,
      writable: true,
      configurable: true,
    });
  });

  function setTTY(value: boolean) {
    Object.defineProperty(process.stdin, 'isTTY', {
      value,
      writable: true,
      configurable: true,
    });
  }

  it('shows select prompt when stdin is a TTY and write-mode not explicitly set', async () => {
    setTTY(true);
    vi.mocked(select).mockResolvedValueOnce('skip-existing');

    // Simulate the prompt condition
    const isSourceCli = false; // --write-mode not passed
    let writeMode = 'backup';
    if (!isSourceCli && process.stdin.isTTY) {
      writeMode = (await select({
        message: 'File write mode:',
        choices: [
          { name: 'Backup existing files and write new (safe, default)', value: 'backup' },
          { name: 'Skip if file already exists', value: 'skip-existing' },
          { name: 'Overwrite without backup', value: 'overwrite' },
        ],
        default: 'backup',
      })) as string;
    }

    expect(select).toHaveBeenCalledOnce();
    expect(writeMode).toBe('skip-existing');
  });

  it('skips prompt when --write-mode flag was explicitly passed (source is cli)', async () => {
    setTTY(true);

    const isSourceCli = true; // --write-mode overwrite passed
    let writeMode = 'overwrite';
    if (!isSourceCli && process.stdin.isTTY) {
      writeMode = (await select({ message: 'File write mode:', choices: [], default: 'backup' })) as string;
    }

    expect(select).not.toHaveBeenCalled();
    expect(writeMode).toBe('overwrite');
  });

  it('skips prompt when stdin is not a TTY (non-interactive / CI)', async () => {
    setTTY(false);

    const isSourceCli = false;
    let writeMode = 'backup';
    if (!isSourceCli && process.stdin.isTTY) {
      writeMode = (await select({ message: 'File write mode:', choices: [], default: 'backup' })) as string;
    }

    expect(select).not.toHaveBeenCalled();
    expect(writeMode).toBe('backup');
  });

  it('backup choice results in backup write mode', async () => {
    setTTY(true);
    vi.mocked(select).mockResolvedValueOnce('backup');

    let writeMode = 'backup';
    const isSourceCli = false;
    if (!isSourceCli && process.stdin.isTTY) {
      writeMode = (await select({
        message: 'File write mode:',
        choices: [
          { name: 'Backup existing files and write new (safe, default)', value: 'backup' },
          { name: 'Skip if file already exists', value: 'skip-existing' },
          { name: 'Overwrite without backup', value: 'overwrite' },
        ],
        default: 'backup',
      })) as string;
    }

    expect(writeMode).toBe('backup');
  });

  it('overwrite choice results in overwrite write mode', async () => {
    setTTY(true);
    vi.mocked(select).mockResolvedValueOnce('overwrite');

    let writeMode = 'backup';
    const isSourceCli = false;
    if (!isSourceCli && process.stdin.isTTY) {
      writeMode = (await select({
        message: 'File write mode:',
        choices: [
          { name: 'Backup existing files and write new (safe, default)', value: 'backup' },
          { name: 'Skip if file already exists', value: 'skip-existing' },
          { name: 'Overwrite without backup', value: 'overwrite' },
        ],
        default: 'backup',
      })) as string;
    }

    expect(writeMode).toBe('overwrite');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
  },
}));

vi.mock('@inquirer/prompts', () => ({
  confirm: vi.fn(),
}));

vi.mock('chalk', () => {
  const s = (x: string) => x;
  const bold = Object.assign((x: string) => x, { cyan: s, magenta: s });
  return { default: { bold, dim: s, green: s, red: s } };
});

import fs from 'fs';
import { confirm } from '@inquirer/prompts';
import { loadConfig, saveConfig, resolveTrackingConsent } from './config.js';

const mockFs = fs as unknown as { readFileSync: ReturnType<typeof vi.fn>; writeFileSync: ReturnType<typeof vi.fn>; mkdirSync: ReturnType<typeof vi.fn> };
const mockConfirm = confirm as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadConfig', () => {
  it('returns {} when config file does not exist', () => {
    mockFs.readFileSync.mockImplementation(() => { throw Object.assign(new Error(), { code: 'ENOENT' }); });
    expect(loadConfig()).toEqual({});
  });

  it('returns parsed JSON when config file exists', () => {
    mockFs.readFileSync.mockReturnValue('{"telemetry":true}');
    expect(loadConfig()).toEqual({ telemetry: true });
  });
});

describe('saveConfig', () => {
  it('creates directory and writes JSON', () => {
    saveConfig({ telemetry: false });
    expect(mockFs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify({ telemetry: false }, null, 2));
  });
});

describe('resolveTrackingConsent', () => {
  it('returns true immediately when config.telemetry is already true', async () => {
    mockFs.readFileSync.mockReturnValue('{"telemetry":true}');
    await expect(resolveTrackingConsent()).resolves.toBe(true);
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it('returns false immediately when config.telemetry is already false', async () => {
    mockFs.readFileSync.mockReturnValue('{"telemetry":false}');
    await expect(resolveTrackingConsent()).resolves.toBe(false);
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it('prompts and saves true when user accepts', async () => {
    mockFs.readFileSync.mockImplementation(() => { throw new Error(); });
    mockConfirm.mockResolvedValue(true);
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true });
    const result = await resolveTrackingConsent();
    Object.defineProperty(process.stdin, 'isTTY', { value: undefined, configurable: true });
    expect(result).toBe(true);
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('"telemetry": true'),
    );
  });

  it('prompts and saves false when user declines', async () => {
    mockFs.readFileSync.mockImplementation(() => { throw new Error(); });
    mockConfirm.mockResolvedValue(false);
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true });
    const result = await resolveTrackingConsent();
    Object.defineProperty(process.stdin, 'isTTY', { value: undefined, configurable: true });
    expect(result).toBe(false);
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('"telemetry": false'),
    );
  });

  it('returns false without prompting when not a TTY', async () => {
    mockFs.readFileSync.mockImplementation(() => { throw new Error(); });
    const origIsTTY = process.stdin.isTTY;
    Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
    const result = await resolveTrackingConsent();
    Object.defineProperty(process.stdin, 'isTTY', { value: origIsTTY, configurable: true });
    expect(result).toBe(false);
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it('does not prompt again after preference is saved', async () => {
    mockFs.readFileSync.mockReturnValue('{"telemetry":true}');
    await resolveTrackingConsent();
    await resolveTrackingConsent();
    expect(mockConfirm).not.toHaveBeenCalled();
  });
});

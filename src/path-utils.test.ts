import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import os from 'os';
import { expandPath } from './path-utils.js';

describe('expandPath', () => {
  const fakeHome = '/Users/testhome';

  beforeEach(() => {
    vi.spyOn(os, 'homedir').mockReturnValue(fakeHome);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('expands ~/ to home', () => {
    expect(expandPath('~/projects')).toBe(`${fakeHome}/projects`);
  });

  it('expands lone ~', () => {
    expect(expandPath('~')).toBe(fakeHome);
  });

  it('leaves other paths unchanged', () => {
    expect(expandPath('/abs/path')).toBe('/abs/path');
    expect(expandPath('./rel')).toBe('./rel');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('mixpanel', () => ({
  default: {
    init: vi.fn(() => ({ track: vi.fn() })),
  },
}));

vi.mock('./config.js', () => ({
  loadConfig: vi.fn(),
}));

import Mixpanel from 'mixpanel';
import { loadConfig } from './config.js';
import { isTrackingEnabled, track } from './telemetry.js';

const mockLoadConfig = loadConfig as ReturnType<typeof vi.fn>;
const mockInit = Mixpanel.init as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('isTrackingEnabled', () => {
  it('returns false when MIXPANEL_TOKEN is empty', () => {
    vi.stubEnv('MIXPANEL_TOKEN', '');
    mockLoadConfig.mockReturnValue({ telemetry: true });
    expect(isTrackingEnabled()).toBe(false);
  });

  it('returns true when token set and config.telemetry is true', () => {
    vi.stubEnv('MIXPANEL_TOKEN', 'test-token');
    mockLoadConfig.mockReturnValue({ telemetry: true });
    expect(isTrackingEnabled()).toBe(true);
  });

  it('returns false when token set but config.telemetry is false', () => {
    vi.stubEnv('MIXPANEL_TOKEN', 'test-token');
    mockLoadConfig.mockReturnValue({ telemetry: false });
    expect(isTrackingEnabled()).toBe(false);
  });

  it('returns true when token set and config.telemetry is undefined (default allow)', () => {
    vi.stubEnv('MIXPANEL_TOKEN', 'test-token');
    mockLoadConfig.mockReturnValue({});
    expect(isTrackingEnabled()).toBe(true);
  });
});

describe('track', () => {
  it('calls Mixpanel.init and client.track when tracking enabled', () => {
    vi.stubEnv('MIXPANEL_TOKEN', 'test-token');
    mockLoadConfig.mockReturnValue({ telemetry: true });
    const mockClient = { track: vi.fn() };
    mockInit.mockReturnValue(mockClient);

    track('cli_run', { preset: 'react-vite-tailwind' });

    expect(mockInit).toHaveBeenCalledWith('test-token', { keep_alive: false });
    expect(mockClient.track).toHaveBeenCalledWith('cli_run', {
      source: 'cli',
      preset: 'react-vite-tailwind',
    });
  });

  it('does not call Mixpanel.init when tracking disabled', () => {
    vi.stubEnv('MIXPANEL_TOKEN', '');
    mockLoadConfig.mockReturnValue({ telemetry: true });

    track('cli_run', { preset: 'react-vite-tailwind' });

    expect(mockInit).not.toHaveBeenCalled();
  });
});

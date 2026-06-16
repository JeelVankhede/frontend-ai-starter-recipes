import Mixpanel from 'mixpanel';
import { loadConfig } from './config.js';

export function isTrackingEnabled(): boolean {
  const token = process.env.MIXPANEL_TOKEN ?? '';
  if (!token) return false;
  const config = loadConfig();
  return config.telemetry !== false;
}

/** Fires a Mixpanel event and resolves when the HTTP request completes or fails.
 *  Never rejects — all errors are swallowed so telemetry never affects the user. */
export function track(event: string, props: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    try {
      const token = process.env.MIXPANEL_TOKEN ?? '';
      if (!isTrackingEnabled()) { resolve(); return; }
      const client = Mixpanel.init(token, { keep_alive: false, ip: false });
      client.track(event, { source: 'cli', ...props }, () => resolve());
    } catch {
      resolve();
    }
  });
}

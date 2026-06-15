import Mixpanel from 'mixpanel';
import { loadConfig } from './config.js';

export function isTrackingEnabled(): boolean {
  const token = process.env.MIXPANEL_TOKEN ?? '';
  if (!token) return false;
  const config = loadConfig();
  return config.telemetry !== false;
}

export function track(event: string, props: Record<string, unknown>): void {
  const token = process.env.MIXPANEL_TOKEN ?? '';
  if (!isTrackingEnabled()) return;
  const client = Mixpanel.init(token, { keep_alive: false });
  client.track(event, { source: 'cli', ...props });
}

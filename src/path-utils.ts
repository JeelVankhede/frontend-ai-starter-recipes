/**
 * Path helpers for CLI resolution.
 * @module path-utils
 */
import os from 'os';

/** Expands a leading `~` to the user home directory. */
export function expandPath(filepath: string): string {
  if (filepath.startsWith('~/') || filepath === '~') {
    return filepath.replace('~', os.homedir());
  }
  return filepath;
}

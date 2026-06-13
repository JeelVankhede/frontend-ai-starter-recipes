/**
 * Creates directories and writes generated files under a target project root.
 * @module writer
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import type { WriteResult } from './types.js';

/**
 * Writes paths relative to a single output directory (the user's project folder).
 * In WP-B every write returns `{ status: 'created' }`; WP-C extends this with backup/skip/overwrite.
 */
export class FileWriter {
  constructor(private outputDir: string) {}

  async write(relativePath: string, content: string): Promise<WriteResult> {
    const fullPath = path.join(this.outputDir, relativePath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, content.trim() + '\n', 'utf-8');

    console.log(chalk.green('✓ Created:'), chalk.dim(relativePath));
    return { path: relativePath, status: 'created' };
  }

  async ensureCleanOutputDir(relativeDir: string) {
    const fullPath = path.join(this.outputDir, relativeDir);
    try {
      await fs.rm(fullPath, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

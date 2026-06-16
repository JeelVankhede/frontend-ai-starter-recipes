/**
 * Creates directories and writes generated files under a target project root,
 * with three modes controlling re-run behavior.
 * @module writer
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import type { WriteMode, WriteResult } from './types.js';

/**
 * Writes paths relative to a single output directory (the user's project folder).
 *
 * Modes:
 * - `backup` (default): existing target → copy to `<path><backupSuffix>`, then write new.
 * - `skip-existing`: existing target → no write, no backup.
 * - `overwrite`: existing target → write unconditionally, no backup.
 *
 * Re-running `backup` mode against an already-backed-up file overwrites the prior backup
 * (single-slot rotation; matches Notion §WP-C Q2 resolution).
 */
export class FileWriter {
  constructor(
    private outputDir: string,
    private mode: WriteMode = 'backup',
    private backupSuffix: string = '.backup',
  ) {}

  async write(relativePath: string, content: string): Promise<WriteResult> {
    const fullPath = path.join(this.outputDir, relativePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    const exists = await fs
      .access(fullPath)
      .then(() => true)
      .catch(() => false);

    if (this.mode === 'skip-existing' && exists) {
      console.log(chalk.dim('↷ Skipped:'), chalk.dim(relativePath), chalk.dim('(already exists)'));
      return { path: relativePath, status: 'skipped' };
    }

    if (this.mode === 'backup' && exists) {
      const backupRelPath = relativePath + this.backupSuffix;
      const backupFullPath = fullPath + this.backupSuffix;
      await fs.copyFile(fullPath, backupFullPath);
      await fs.writeFile(fullPath, content.trim() + '\n', 'utf-8');
      console.log(
        chalk.yellow('◈ Backed up:'),
        chalk.dim(relativePath),
        chalk.dim('→'),
        chalk.dim(backupRelPath),
      );
      return { path: relativePath, status: 'backed-up' };
    }

    await fs.writeFile(fullPath, content.trim() + '\n', 'utf-8');
    if (exists) {
      console.log(chalk.cyan('↺ Overwritten:'), chalk.dim(relativePath));
      return { path: relativePath, status: 'overwritten' };
    }
    console.log(chalk.green('✔ Created:'), chalk.dim(relativePath));
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

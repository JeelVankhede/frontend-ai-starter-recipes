/**
 * Creates directories and writes generated files under a target project root.
 * @module writer
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

/**
 * Writes paths relative to a single output directory (the user's project folder).
 */
export class FileWriter {
  constructor(private outputDir: string) {}

  async write(relativePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.outputDir, relativePath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, content.trim() + '\n', 'utf-8');

    console.log(chalk.green('✓ Created:'), chalk.dim(relativePath));
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

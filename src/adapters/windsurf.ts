/**
 * Writes a single `.windsurfrules` file from merged `.ai` agent + rules.
 * @module adapters/windsurf
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import type { FileWriter } from '../writer.js';

export async function generateWindsurf(outputDir: string, writer: FileWriter) {
  const aiDir = path.join(outputDir, '.ai');

  try {
    let mergedContent = '';

    const agentContent = await fs.readFile(path.join(aiDir, 'AGENT.md'), 'utf-8');
    mergedContent += removeFrontmatter(agentContent) + '\n\n';

    const rulesDir = path.join(aiDir, 'rules');
    try {
      const ruleFiles = await fs.readdir(rulesDir);
      for (const file of ruleFiles) {
        if (!file.endsWith('.md')) continue;
        const content = await fs.readFile(path.join(rulesDir, file), 'utf-8');
        mergedContent += removeFrontmatter(content) + '\n\n';
      }
    } catch {
      /* no rules */
    }

    await writer.write('.windsurfrules', mergedContent);

    console.log(chalk.dim('  ↳ Generated Windsurf configuration'));
  } catch (err) {
    console.error(chalk.red('Failed to generate Windsurf config:'), err);
  }
}

function removeFrontmatter(content: string) {
  return content.replace(/^---\n[\s\S]*?\n---\n+/, '');
}

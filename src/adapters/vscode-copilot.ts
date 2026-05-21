/**
 * Writes `.github/copilot-instructions.md` from merged `.ai` agent + rules.
 * @module adapters/vscode-copilot
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import type { FileWriter } from '../writer.js';
import { readLifecycleContent, removeFrontmatter } from './lifecycle.js';

export async function generateVsCodeCopilot(outputDir: string, writer: FileWriter) {
  const aiDir = path.join(outputDir, '.ai');

  try {
    let mergedContent = '';

    const agentContent = await fs.readFile(path.join(aiDir, 'AGENT.md'), 'utf-8');
    mergedContent += removeFrontmatter(agentContent) + '\n\n';

    mergedContent += await readLifecycleContent(aiDir);

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

    await writer.write('.github/copilot-instructions.md', mergedContent);

    console.log(chalk.dim('  ↳ Generated VS Code Copilot configuration'));
  } catch (err) {
    console.error(chalk.red('Failed to generate VS Code Copilot config:'), err);
  }
}

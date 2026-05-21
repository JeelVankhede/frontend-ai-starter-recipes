/**
 * Produces `CLAUDE.md` and `.claude/skills/` from canonical `.ai/` content.
 * @module adapters/claude-code
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import type { FileWriter } from '../writer.js';
import { readLifecycleContent, removeFrontmatter } from './lifecycle.js';

export async function generateClaudeCode(outputDir: string, writer: FileWriter) {
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

    await writer.write('CLAUDE.md', mergedContent);

    const skillsDir = path.join(aiDir, 'skills');
    try {
      const skills = await fs.readdir(skillsDir);
      for (const skill of skills) {
        const skillPath = path.join(skillsDir, skill);
        const stat = await fs.stat(skillPath);
        if (stat.isDirectory()) {
          const files = await fs.readdir(skillPath);
          for (const file of files) {
            const content = await fs.readFile(path.join(skillPath, file), 'utf-8');
            await writer.write(`.claude/skills/${skill}/${file}`, content);
          }
        }
      }
    } catch {
      /* no skills */
    }

    console.log(chalk.dim('  ↳ Generated Claude Code configuration'));
  } catch (err) {
    console.error(chalk.red('Failed to generate Claude Code config:'), err);
  }
}

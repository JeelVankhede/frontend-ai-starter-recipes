/**
 * Maps .ai/skills skill folders into Antigravity .agents/workflows markdown files.
 * @module adapters/antigravity
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import type { FileWriter } from '../writer.js';

const SKILL_FILENAME = 'SKILL.md' as const;

export async function generateAntigravity(outputDir: string, writer: FileWriter) {
  const aiDir = path.join(outputDir, '.ai');
  const skillsDir = path.join(aiDir, 'skills');

  try {
    const skills = await fs.readdir(skillsDir);
    for (const skill of skills) {
      const skillPath = path.join(skillsDir, skill);
      const stat = await fs.stat(skillPath);
      if (stat.isDirectory()) {
        try {
          const content = await fs.readFile(path.join(skillPath, SKILL_FILENAME), 'utf-8');
          await writer.write(`.agents/workflows/${skill}.md`, content);
        } catch {
          /* skill without SKILL_FILENAME */
        }
      }
    }
    console.log(chalk.dim('  ↳ Generated Antigravity workflows'));
  } catch {
    /* missing skills dir */
  }
}

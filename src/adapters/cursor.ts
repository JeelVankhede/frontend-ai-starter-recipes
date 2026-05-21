/**
 * Maps canonical `.ai/` output into Cursor `.cursor/rules/*.mdc` and skills layout.
 * @module adapters/cursor
 */
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import type { FileWriter } from '../writer.js';
import { readLifecycleContent } from './lifecycle.js';

/**
 * Reads generated `.ai` files and writes Cursor-specific rule files with frontmatter.
 */
export async function generateCursor(outputDir: string, writer: FileWriter) {
  const aiDir = path.join(outputDir, '.ai');

  try {
    const agentContent = await fs.readFile(path.join(aiDir, 'AGENT.md'), 'utf-8');
    await writer.write('.cursor/rules/index.mdc', addFrontmatter(agentContent, 'alwaysApply: true', 'Master Instructions'));

    const rulesDir = path.join(aiDir, 'rules');
    const ruleFiles = await fs.readdir(rulesDir);

    for (const file of ruleFiles) {
      if (!file.endsWith('.md')) continue;
      const content = await fs.readFile(path.join(rulesDir, file), 'utf-8');
      const basename = path.basename(file, '.md');

      let ruleLine = 'alwaysApply: true';
      if (basename === 'component-patterns') {
        ruleLine = formatGlobs(['**/*.tsx', '**/*.vue', '**/*.svelte', 'src/components/**/*']);
      } else if (basename === 'styling') {
        ruleLine = formatGlobs([
          '**/*.css',
          '**/*.scss',
          '**/*.module.css',
          '**/*.styled.ts',
          'tailwind.config.*',
        ]);
      } else if (basename === 'state-management') {
        ruleLine = formatGlobs(['src/store/**/*', 'src/stores/**/*', '**/*.store.ts', '**/*.slice.ts']);
      } else if (basename === 'data-fetching') {
        ruleLine = formatGlobs([
          'src/api/**/*',
          'src/hooks/use*.ts',
          'src/composables/**/*',
          'src/services/**/*',
        ]);
      } else if (basename === 'testing') {
        ruleLine = formatGlobs([
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.spec.ts',
          '**/*.spec.tsx',
          'cypress/**/*',
          'e2e/**/*',
        ]);
      } else if (basename === 'forms-validation') {
        ruleLine = formatGlobs(['**/*.schema.ts', 'src/forms/**/*', '**/*.form.tsx']);
      } else if (basename === 'routing') {
        ruleLine = formatGlobs(['src/routes/**/*', 'src/pages/**/*', 'app/routes/**/*', 'src/app/**/*']);
      } else if (basename === 'seo-meta') {
        ruleLine = formatGlobs(['src/pages/**/*', 'app/**/*.tsx', '**/*.head.tsx', 'next-seo.config.*']);
      }

      await writer.write(`.cursor/rules/${basename}.mdc`, addFrontmatter(content, ruleLine, basename));
    }

    const lifecycleContent = await readLifecycleContent(aiDir);
    if (lifecycleContent.trim()) {
      await writer.write(
        '.cursor/rules/lifecycle.mdc',
        addFrontmatter(lifecycleContent, 'alwaysApply: true', 'Lifecycle workflow'),
      );
    }

    const skillsDir = path.join(aiDir, 'skills');
    try {
      const skills = await fs.readdir(skillsDir);
      for (const skill of skills) {
        const skillPath = path.join(skillsDir, skill);
        const stat = await fs.stat(skillPath);
        if (stat.isDirectory()) {
          const files = await fs.readdir(skillPath);
          for (const file of files) {
            const skillContent = await fs.readFile(path.join(skillPath, file), 'utf-8');
            await writer.write(`.cursor/skills/${skill}/${file}`, skillContent);
          }
        }
      }
    } catch {
      /* no skills */
    }

    console.log(chalk.dim('  ↳ Generated Cursor configuration'));
  } catch (err) {
    console.error(chalk.red('Failed to generate Cursor config:'), err);
  }
}

function addFrontmatter(content: string, rule: string, description: string) {
  return `---
description: ${description}
${rule}
---

${content.replace(/^---\n[\s\S]*?\n---\n+/, '')}`;
}

function formatGlobs(patterns: string[]) {
  return ['globs:', ...patterns.map((pattern) => `  - ${JSON.stringify(pattern)}`)].join('\n');
}

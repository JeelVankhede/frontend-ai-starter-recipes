/**
 * Cursor adapter — renders `.cursor/rules/*.mdc` + `.cursor/rules/index.mdc` +
 * `.cursor/skills/<stage>/SKILL.md` (lifecycle as skills) from in-memory `RenderedContext`.
 * @module adapters/cursor
 */
import chalk from 'chalk';
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';
import { removeFrontmatter, extractDescription, formatGlobs } from './helpers.js';
import { RULE_CURSOR_METADATA, type CursorRuleMeta } from '../rule-cursor-metadata.js';

function formatDirective(directive: CursorRuleMeta): string {
  if ('globs' in directive) {
    return formatGlobs(directive.globs);
  }
  return `alwaysApply: ${directive.alwaysApply}`;
}

export async function generateCursor(
  writer: FileWriter,
  rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  const results: WriteResult[] = [];

  // 1. Master index
  const indexBody = removeFrontmatter(rendered.agent);
  const indexContent = `---\ndescription: Master Instructions\nalwaysApply: true\n---\n\n${indexBody}`;
  results.push(await writer.write('.cursor/rules/index.mdc', indexContent));

  // 2. Per-rule .mdc files
  for (const [ruleName, content] of Object.entries(rendered.rules)) {
    const directive: CursorRuleMeta = RULE_CURSOR_METADATA[ruleName] ?? { alwaysApply: true };
    const description = extractDescription(content) || ruleName;
    const body = removeFrontmatter(content);
    const frontmatter = `---\ndescription: ${description}\n${formatDirective(directive)}\n---`;
    const fileContent = `${frontmatter}\n\n${body}`;
    results.push(await writer.write(`.cursor/rules/${ruleName}.mdc`, fileContent));
  }

  // 3. Lifecycle stages as skills
  for (const [stageName, content] of Object.entries(rendered.lifecycle)) {
    results.push(await writer.write(`.cursor/skills/${stageName}/SKILL.md`, content));
  }

  console.log(chalk.dim('  ↳ Generated Cursor configuration'));
  return results;
}

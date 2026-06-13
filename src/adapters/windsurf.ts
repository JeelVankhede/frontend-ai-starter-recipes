/**
 * Windsurf adapter — renders slim `.windsurfrules` (AGENT only) + per-rule
 * `.windsurf/rules/<rule>.md` + per-stage `.windsurf/rules/lifecycle-<stage>.md`
 * from in-memory `RenderedContext`.
 * @module adapters/windsurf
 */
import chalk from 'chalk';
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';
import { removeFrontmatter } from './helpers.js';

export async function generateWindsurf(
  writer: FileWriter,
  rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  const results: WriteResult[] = [];

  // 1. Slim AGENT-only root file
  const agentBody = removeFrontmatter(rendered.agent);
  results.push(await writer.write('.windsurfrules', agentBody));

  // 2. Per-rule .windsurf/rules/<ruleName>.md (strip WP-D frontmatter)
  for (const [ruleName, content] of Object.entries(rendered.rules)) {
    const body = removeFrontmatter(content);
    results.push(await writer.write(`.windsurf/rules/${ruleName}.md`, body));
  }

  // 3. Per-lifecycle-stage .windsurf/rules/lifecycle-<stageName>.md (as-is)
  for (const [stageName, content] of Object.entries(rendered.lifecycle)) {
    results.push(await writer.write(`.windsurf/rules/lifecycle-${stageName}.md`, content));
  }

  console.log(chalk.dim('  ↳ Generated Windsurf configuration'));
  return results;
}

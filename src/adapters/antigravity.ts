/**
 * Antigravity adapter — renders 7 lifecycle stage workflows `.agents/workflows/<stage>.md`
 * from in-memory `RenderedContext`. No rules, no AGENT, no skills.
 * @module adapters/antigravity
 */
import chalk from 'chalk';
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';

export async function generateAntigravity(
  writer: FileWriter,
  rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  const results: WriteResult[] = [];

  for (const [stageName, content] of Object.entries(rendered.lifecycle)) {
    results.push(await writer.write(`.agents/workflows/${stageName}.md`, content));
  }

  console.log(chalk.dim('  ↳ Generated Antigravity workflows'));
  return results;
}

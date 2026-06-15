/**
 * Antigravity adapter — renders 7 lifecycle stage workflows `.agents/workflows/<stage>.md`
 * from in-memory `RenderedContext`. No rules, no AGENT, no skills.
 * @module adapters/antigravity
 */
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';
import { sleep } from '../sleep.js';

export async function generateAntigravity(
  writer: FileWriter,
  rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  const results: WriteResult[] = [];

  for (const [stageName, content] of Object.entries(rendered.lifecycle)) {
    results.push(await writer.write(`.agents/workflows/${stageName}.md`, content));
    await sleep(300);
  }

  return results;
}

/**
 * Antigravity adapter — renders 7 lifecycle stage workflows `.agents/workflows/<stage>.md`
 * from in-memory `RenderedContext`. No rules, no AGENT, no skills.
 * Real body implemented in WP-B Phase 3 (Wave 2 subagent E).
 * @module adapters/antigravity
 */
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';

export async function generateAntigravity(
  _writer: FileWriter,
  _rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  return [];
}

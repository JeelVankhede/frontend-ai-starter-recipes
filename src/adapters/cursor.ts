/**
 * Cursor adapter — renders `.cursor/rules/*.mdc` + `.cursor/rules/index.mdc` +
 * `.cursor/skills/<stage>/SKILL.md` (lifecycle as skills) from in-memory `RenderedContext`.
 * Real body implemented in WP-B Phase 2 (Wave 1 subagent A).
 * @module adapters/cursor
 */
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';

export async function generateCursor(
  _writer: FileWriter,
  _rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  return [];
}

/**
 * Windsurf adapter — renders slim `.windsurfrules` (AGENT only) + per-rule
 * `.windsurf/rules/<rule>.md` + per-stage `.windsurf/rules/lifecycle-<stage>.md`
 * from in-memory `RenderedContext`.
 * Real body implemented in WP-B Phase 3 (Wave 2 subagent D).
 * @module adapters/windsurf
 */
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';

export async function generateWindsurf(
  _writer: FileWriter,
  _rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  return [];
}

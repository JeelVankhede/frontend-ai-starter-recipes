/**
 * Claude Code adapter — renders `.claude/rules/<rule>.md`, `.claude/commands/<stage>.md`,
 * and a slim `CLAUDE.md` (AGENT body + load-when pointer index for rules + Lifecycle pointer
 * section for commands) from in-memory `RenderedContext`.
 * Real body implemented in WP-B Phase 2 (Wave 1 subagent B).
 * @module adapters/claude-code
 */
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';

export async function generateClaudeCode(
  _writer: FileWriter,
  _rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  return [];
}

/**
 * VS Code Copilot adapter — renders a single `.github/copilot-instructions.md` merging
 * AGENT body + `## Lifecycle: <Stage>` sections + rule sections from in-memory `RenderedContext`.
 * Real body implemented in WP-B Phase 2 (Wave 1 subagent C).
 * @module adapters/vscode-copilot
 */
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';

export async function generateVsCodeCopilot(
  _writer: FileWriter,
  _rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  return [];
}

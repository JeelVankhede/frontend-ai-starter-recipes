/**
 * VS Code Copilot adapter — renders a single `.github/copilot-instructions.md` merging
 * AGENT body + `## Lifecycle: <Stage>` sections + rule sections from in-memory `RenderedContext`.
 * @module adapters/vscode-copilot
 */
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';
import { removeFrontmatter } from './helpers.js';
import { sleep } from '../sleep.js';

export async function generateVsCodeCopilot(
  writer: FileWriter,
  rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  const sections: string[] = [];

  // 1. AGENT body (frontmatter stripped)
  sections.push(removeFrontmatter(rendered.agent));

  // 2. Lifecycle stages as `## Lifecycle: <Stage>` sections
  for (const [stageName, content] of Object.entries(rendered.lifecycle)) {
    const heading = `## Lifecycle: ${stageName[0].toUpperCase() + stageName.slice(1)}`;
    sections.push(`${heading}\n\n${content}`);
  }

  // 3. Rule sections (frontmatter stripped; each rule already starts with its own `# Title`)
  for (const [, content] of Object.entries(rendered.rules)) {
    sections.push(removeFrontmatter(content));
  }

  const body = sections.map((s) => s.replace(/\s+$/, '')).join('\n\n') + '\n';

  const result = await writer.write('.github/copilot-instructions.md', body);
  await sleep(300);

  return [result];
}

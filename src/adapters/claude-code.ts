/**
 * Claude Code adapter — renders `.claude/rules/<rule>.md`, `.claude/commands/<stage>.md`,
 * and a slim `CLAUDE.md` (AGENT body + load-when pointer index for rules + Lifecycle pointer
 * section for commands) from in-memory `RenderedContext`.
 * @module adapters/claude-code
 */
import type { FileWriter } from '../writer.js';
import type { RenderedContext, TemplateContext, WriteResult } from '../types.js';
import { removeFrontmatter, extractDescription } from './helpers.js';
import { sleep } from '../sleep.js';

export async function generateClaudeCode(
  writer: FileWriter,
  rendered: RenderedContext,
  _context: TemplateContext,
): Promise<WriteResult[]> {
  const results: WriteResult[] = [];

  // 1. Per-rule files under .claude/rules/
  for (const [ruleName, content] of Object.entries(rendered.rules)) {
    const body = removeFrontmatter(content);
    results.push(await writer.write(`.claude/rules/${ruleName}.md`, body));
    await sleep(300);
  }

  // 2. Per-stage lifecycle commands under .claude/commands/
  for (const [stageName, content] of Object.entries(rendered.lifecycle)) {
    results.push(await writer.write(`.claude/commands/${stageName}.md`, content));
    await sleep(300);
  }

  // 3. Slim CLAUDE.md pointer index at output root.
  const agentBody = removeFrontmatter(rendered.agent);
  const ruleLines = Object.entries(rendered.rules).map(([ruleName, content]) => {
    const desc = extractDescription(content) || ruleName;
    return `- [${ruleName}](.claude/rules/${ruleName}.md) — load when ${desc}.`;
  });
  const lifecycleLines = Object.keys(rendered.lifecycle).map(
    (stageName) => `- [${stageName}](.claude/commands/${stageName}.md) — invoke as /${stageName}.`,
  );

  const claudeMd = [
    agentBody,
    '',
    '## Rules',
    '',
    ...ruleLines,
    '',
    '## Lifecycle',
    '',
    ...lifecycleLines,
  ].join('\n');

  results.push(await writer.write('CLAUDE.md', claudeMd));
  await sleep(300);

  return results;
}

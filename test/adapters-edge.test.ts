/**
 * Edge-case tests for the five IDE adapters: empty inputs, fallbacks, and
 * per-adapter quirks. All inputs are in-memory `RenderedContext` values.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../src/sleep.js', () => ({ sleep: vi.fn().mockResolvedValue(undefined) }));
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { FileWriter } from '../src/writer.js';
import { generateCursor } from '../src/adapters/cursor.js';
import { generateClaudeCode } from '../src/adapters/claude-code.js';
import { generateVsCodeCopilot } from '../src/adapters/vscode-copilot.js';
import { generateAntigravity } from '../src/adapters/antigravity.js';
import { generateWindsurf } from '../src/adapters/windsurf.js';
import type { RenderedContext, TemplateContext } from '../src/types.js';
import { EMPTY_RENDERED } from './fixtures/rendered-context.js';

const FAKE_CONTEXT = {} as TemplateContext;

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

describe('IDE adapters — edge cases', () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-adapters-edge-'));
  });

  it('Cursor: empty rules + empty lifecycle still writes index.mdc', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateCursor(writer, EMPTY_RENDERED, FAKE_CONTEXT);

    expect(results).toHaveLength(1);
    const index = await fs.readFile(path.join(tmp, '.cursor/rules/index.mdc'), 'utf-8');
    expect(index).toMatch(/description:\s*Master Instructions/);
    expect(index).toMatch(/alwaysApply:\s*true/);
    expect(index).toMatch(/# Empty Agent/);
    expect(await exists(path.join(tmp, '.cursor/skills'))).toBe(false);
  });

  it('Cursor: unknown rule name (not in RULE_CURSOR_METADATA) falls back to alwaysApply: true', async () => {
    const writer = new FileWriter(tmp);
    const ctx: RenderedContext = {
      agent: '# Agent\n',
      rules: {
        'totally-unknown-rule':
          '---\ndescription: Unknown rule desc\n---\n\n# Unknown\n\nUnknown body.\n',
      },
      lifecycle: {},
    };
    await generateCursor(writer, ctx, FAKE_CONTEXT);

    const file = await fs.readFile(
      path.join(tmp, '.cursor/rules/totally-unknown-rule.mdc'),
      'utf-8',
    );
    expect(file).toMatch(/description:\s*Unknown rule desc/);
    expect(file).toMatch(/alwaysApply:\s*true/);
    expect(file).not.toMatch(/globs:/);
  });

  it('Cursor: rule body without description frontmatter falls back to rule basename', async () => {
    const writer = new FileWriter(tmp);
    const ctx: RenderedContext = {
      agent: '# Agent\n',
      rules: {
        architecture: '# Architecture\n\nNo frontmatter here.\n',
      },
      lifecycle: {},
    };
    await generateCursor(writer, ctx, FAKE_CONTEXT);

    const file = await fs.readFile(
      path.join(tmp, '.cursor/rules/architecture.mdc'),
      'utf-8',
    );
    // description falls back to rule basename ("architecture")
    expect(file).toMatch(/^description:\s*architecture$/m);
    expect(file).toMatch(/alwaysApply:\s*true/);
  });

  it('Claude Code: rule without description frontmatter falls back to rule name in CLAUDE.md pointer', async () => {
    const writer = new FileWriter(tmp);
    const ctx: RenderedContext = {
      agent: '# Agent\n',
      rules: { architecture: '# Architecture\n\nNo frontmatter here.\n' },
      lifecycle: {},
    };
    await generateClaudeCode(writer, ctx, FAKE_CONTEXT);

    const claudeMd = await fs.readFile(path.join(tmp, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toMatch(
      /- \[architecture\]\(\.claude\/rules\/architecture\.md\) — load when architecture\./,
    );
  });

  it('Claude Code: EMPTY_RENDERED writes CLAUDE.md with Rules + Lifecycle headings but no list items', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateClaudeCode(writer, EMPTY_RENDERED, FAKE_CONTEXT);

    // Only CLAUDE.md
    expect(results).toHaveLength(1);
    const claudeMd = await fs.readFile(path.join(tmp, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toMatch(/# Empty Agent/);
    expect(claudeMd).toMatch(/## Rules/);
    expect(claudeMd).toMatch(/## Lifecycle/);
    // No bullet entries
    expect(claudeMd).not.toMatch(/^- \[/m);
    expect(await exists(path.join(tmp, '.claude/rules'))).toBe(false);
    expect(await exists(path.join(tmp, '.claude/commands'))).toBe(false);
  });

  it('Copilot: AGENT-only RenderedContext still produces the merged file', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateVsCodeCopilot(writer, EMPTY_RENDERED, FAKE_CONTEXT);

    expect(results).toHaveLength(1);
    const body = await fs.readFile(
      path.join(tmp, '.github/copilot-instructions.md'),
      'utf-8',
    );
    expect(body).toMatch(/# Empty Agent/);
    expect(body).not.toMatch(/## Lifecycle:/);
  });

  it('Windsurf: EMPTY_RENDERED writes only .windsurfrules', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateWindsurf(writer, EMPTY_RENDERED, FAKE_CONTEXT);

    expect(results).toHaveLength(1);
    const root = await fs.readFile(path.join(tmp, '.windsurfrules'), 'utf-8');
    expect(root).toMatch(/# Empty Agent/);
    expect(await exists(path.join(tmp, '.windsurf/rules'))).toBe(false);
  });

  it('Antigravity: EMPTY_RENDERED writes zero files', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateAntigravity(writer, EMPTY_RENDERED, FAKE_CONTEXT);

    expect(results).toHaveLength(0);
    expect(await exists(path.join(tmp, '.agents'))).toBe(false);
  });

  it('Cursor: glob directive emits YAML list, not a JSON-stringified single line', async () => {
    const writer = new FileWriter(tmp);
    const ctx: RenderedContext = {
      agent: '# Agent\n',
      rules: {
        components:
          '---\ndescription: Components rule\n---\n\n# Components\n\nBody.\n',
      },
      lifecycle: {},
    };
    await generateCursor(writer, ctx, FAKE_CONTEXT);

    const file = await fs.readFile(
      path.join(tmp, '.cursor/rules/components.mdc'),
      'utf-8',
    );
    expect(file).toMatch(/globs:\n  - "\*\*\/\*\.tsx"/);
    // Never collapse the array into a single inline JSON string
    expect(file).not.toMatch(/globs:\s*"\[/);
  });
});

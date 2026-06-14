/**
 * Integration tests for the five IDE adapters using in-memory `RenderedContext`.
 * Replaces the v1.1 `minimal-ai/` on-disk fixture seeding.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { FileWriter } from '../src/writer.js';
import { generateCursor } from '../src/adapters/cursor.js';
import { generateClaudeCode } from '../src/adapters/claude-code.js';
import { generateVsCodeCopilot } from '../src/adapters/vscode-copilot.js';
import { generateAntigravity } from '../src/adapters/antigravity.js';
import { generateWindsurf } from '../src/adapters/windsurf.js';
import type { TemplateContext } from '../src/types.js';
import { MINIMAL_RENDERED } from './fixtures/rendered-context.js';

const FAKE_CONTEXT = {} as TemplateContext;

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

describe('IDE adapters (in-memory RenderedContext)', () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-adapters-'));
  });

  it('generateCursor writes index + per-rule .mdc + lifecycle SKILL.md', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateCursor(writer, MINIMAL_RENDERED, FAKE_CONTEXT);

    // 1 index + 3 rules + 7 lifecycle stages = 11
    expect(results).toHaveLength(11);

    const index = await fs.readFile(path.join(tmp, '.cursor/rules/index.mdc'), 'utf-8');
    expect(index).toMatch(/description:\s*Master Instructions/);
    expect(index).toMatch(/alwaysApply:\s*true/);
    expect(index).toMatch(/FARE Test Agent/);
    // frontmatter body separation: 2 `---` fences
    expect(index.match(/^---$/gm) ?? []).toHaveLength(2);

    const architecture = await fs.readFile(
      path.join(tmp, '.cursor/rules/architecture.mdc'),
      'utf-8',
    );
    expect(architecture).toMatch(/description:\s*Architecture rule/);
    expect(architecture).toMatch(/alwaysApply:\s*true/);
    expect(architecture).toMatch(/Architecture body\./);

    const components = await fs.readFile(
      path.join(tmp, '.cursor/rules/components.mdc'),
      'utf-8',
    );
    expect(components).toMatch(/description:\s*Components rule/);
    expect(components).toMatch(/globs:/);
    expect(components).toContain('  - "**/*.tsx"');
    expect(components).toContain('  - "**/*.vue"');
    expect(components).toContain('  - "**/*.svelte"');
    expect(components).toContain('  - "src/components/**/*"');
    expect(components).not.toMatch(/alwaysApply/);

    const thinkSkill = await fs.readFile(
      path.join(tmp, '.cursor/skills/think/SKILL.md'),
      'utf-8',
    );
    expect(thinkSkill).toMatch(/Lifecycle fixture think/);

    const reflectSkill = await fs.readFile(
      path.join(tmp, '.cursor/skills/reflect/SKILL.md'),
      'utf-8',
    );
    expect(reflectSkill).toMatch(/Lifecycle fixture reflect/);
  });

  it('generateClaudeCode writes per-rule .md, per-stage commands, and slim CLAUDE.md', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateClaudeCode(writer, MINIMAL_RENDERED, FAKE_CONTEXT);

    // 3 rules + 7 lifecycle + 1 CLAUDE.md = 11
    expect(results).toHaveLength(11);

    const archRule = await fs.readFile(
      path.join(tmp, '.claude/rules/architecture.md'),
      'utf-8',
    );
    // Frontmatter must be stripped
    expect(archRule).not.toMatch(/^---/);
    expect(archRule).toMatch(/# Architecture/);
    expect(archRule).toMatch(/Architecture body\./);

    const planCmd = await fs.readFile(
      path.join(tmp, '.claude/commands/plan.md'),
      'utf-8',
    );
    expect(planCmd).toMatch(/Lifecycle fixture plan/);

    const claudeMd = await fs.readFile(path.join(tmp, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toMatch(/FARE Test Agent/);
    expect(claudeMd).toMatch(/## Rules/);
    expect(claudeMd).toMatch(
      /- \[architecture\]\(\.claude\/rules\/architecture\.md\) — load when Architecture rule\./,
    );
    expect(claudeMd).toMatch(
      /- \[components\]\(\.claude\/rules\/components\.md\) — load when Components rule\./,
    );
    expect(claudeMd).toMatch(/## Lifecycle/);
    expect(claudeMd).toMatch(
      /- \[think\]\(\.claude\/commands\/think\.md\) — invoke as \/think\./,
    );
    expect(claudeMd).toMatch(
      /- \[reflect\]\(\.claude\/commands\/reflect\.md\) — invoke as \/reflect\./,
    );
  });

  it('generateVsCodeCopilot writes single merged .github/copilot-instructions.md', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateVsCodeCopilot(writer, MINIMAL_RENDERED, FAKE_CONTEXT);

    expect(results).toHaveLength(1);
    expect(results[0].path).toBe('.github/copilot-instructions.md');

    const body = await fs.readFile(
      path.join(tmp, '.github/copilot-instructions.md'),
      'utf-8',
    );
    // AGENT body at top, no leading frontmatter from rules
    expect(body).toMatch(/^# FARE Test Agent/);
    // Each lifecycle stage rendered with `## Lifecycle: <Stage>` heading
    expect(body).toMatch(/## Lifecycle: Think/);
    expect(body).toMatch(/## Lifecycle: Plan/);
    expect(body).toMatch(/## Lifecycle: Reflect/);
    expect(body).toMatch(/Lifecycle fixture build/);
    // Rule bodies appended after frontmatter strip
    expect(body).toMatch(/# Architecture\n\nArchitecture body\./);
    expect(body).toMatch(/# Components\n\nComponents body/);
    // Source frontmatter must not leak through
    expect(body).not.toMatch(/^description: Architecture rule$/m);
  });

  it('generateWindsurf writes slim .windsurfrules + per-rule + per-stage lifecycle files', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateWindsurf(writer, MINIMAL_RENDERED, FAKE_CONTEXT);

    // 1 .windsurfrules + 3 rules + 7 lifecycle = 11
    expect(results).toHaveLength(11);

    const root = await fs.readFile(path.join(tmp, '.windsurfrules'), 'utf-8');
    expect(root).toMatch(/# FARE Test Agent/);
    // Rule frontmatter must be stripped
    const archRule = await fs.readFile(
      path.join(tmp, '.windsurf/rules/architecture.md'),
      'utf-8',
    );
    expect(archRule).not.toMatch(/^---/);
    expect(archRule).toMatch(/# Architecture/);

    const lifecyclePlan = await fs.readFile(
      path.join(tmp, '.windsurf/rules/lifecycle-plan.md'),
      'utf-8',
    );
    expect(lifecyclePlan).toMatch(/Lifecycle fixture plan/);

    const lifecycleReflect = await fs.readFile(
      path.join(tmp, '.windsurf/rules/lifecycle-reflect.md'),
      'utf-8',
    );
    expect(lifecycleReflect).toMatch(/Lifecycle fixture reflect/);
  });

  it('generateAntigravity writes 7 workflows under .agents/workflows/, no rules or AGENT', async () => {
    const writer = new FileWriter(tmp);
    const results = await generateAntigravity(writer, MINIMAL_RENDERED, FAKE_CONTEXT);

    expect(results).toHaveLength(7);
    for (const stage of ['think', 'plan', 'build', 'review', 'test', 'ship', 'reflect']) {
      const wf = await fs.readFile(
        path.join(tmp, `.agents/workflows/${stage}.md`),
        'utf-8',
      );
      expect(wf).toMatch(new RegExp(`Lifecycle fixture ${stage}`));
    }

    // No rules, no AGENT, no skills directories
    expect(await exists(path.join(tmp, '.agents/rules'))).toBe(false);
    expect(await exists(path.join(tmp, '.cursor'))).toBe(false);
    expect(await exists(path.join(tmp, '.windsurfrules'))).toBe(false);
  });
});

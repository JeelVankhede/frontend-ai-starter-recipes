import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { FileWriter } from '../src/writer.js';
import { generateCursor } from '../src/adapters/cursor.js';
import { generateClaudeCode } from '../src/adapters/claude-code.js';
import { generateVsCodeCopilot } from '../src/adapters/vscode-copilot.js';
import { generateWindsurf } from '../src/adapters/windsurf.js';
import { generateAntigravity } from '../src/adapters/antigravity.js';

describe('adapter error and branch paths', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generateCursor logs error when .ai is missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-cur-err-'));
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    expect(vi.mocked(console.error)).toHaveBeenCalled();
  });

  it('generateClaudeCode logs error when AGENT.md missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-claude-err-'));
    const writer = new FileWriter(tmp);
    await generateClaudeCode(tmp, writer);
    expect(vi.mocked(console.error)).toHaveBeenCalled();
  });

  it('generateVsCodeCopilot logs error when .ai missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-copilot-err-'));
    const writer = new FileWriter(tmp);
    await generateVsCodeCopilot(tmp, writer);
    expect(vi.mocked(console.error)).toHaveBeenCalled();
  });

  it('generateWindsurf logs error when .ai missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-wind-err-'));
    const writer = new FileWriter(tmp);
    await generateWindsurf(tmp, writer);
    expect(vi.mocked(console.error)).toHaveBeenCalled();
  });

  it('generateVsCodeCopilot succeeds with AGENT only (no rules dir)', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-copilot-agent-'));
    await fs.mkdir(path.join(tmp, '.ai'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# Agent only');
    const writer = new FileWriter(tmp);
    await generateVsCodeCopilot(tmp, writer);
    const md = await fs.readFile(path.join(tmp, '.github', 'copilot-instructions.md'), 'utf-8');
    expect(md).toMatch(/Agent only/);
  });

  it('generateVsCodeCopilot includes lifecycle content when present', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-copilot-life-'));
    await fs.mkdir(path.join(tmp, '.ai', 'lifecycle'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# Agent');
    await fs.writeFile(path.join(tmp, '.ai', 'lifecycle', 'think.md'), '# Think life');
    const writer = new FileWriter(tmp);
    await generateVsCodeCopilot(tmp, writer);
    const md = await fs.readFile(path.join(tmp, '.github', 'copilot-instructions.md'), 'utf-8');
    expect(md).toMatch(/Think life/);
  });

  it('generateWindsurf succeeds with AGENT only', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-wind-agent-'));
    await fs.mkdir(path.join(tmp, '.ai'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# W');
    const writer = new FileWriter(tmp);
    await generateWindsurf(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.windsurfrules'), 'utf-8')).toMatch(/W/);
  });

  it('generateClaudeCode with agent only + skills as file (inner catch)', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-claude-sk-'));
    await fs.mkdir(path.join(tmp, '.ai'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'skills'), 'not-a-dir');
    const writer = new FileWriter(tmp);
    await generateClaudeCode(tmp, writer);
    const claude = await fs.readFile(path.join(tmp, 'CLAUDE.md'), 'utf-8');
    expect(claude).toMatch(/A/);
  });

  it('generateCursor skips non-directory entries in skills', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-cur-skip-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'x.md'), '# R');
    await fs.mkdir(path.join(tmp, '.ai', 'skills'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 'not-folder'), 'x');
    await fs.mkdir(path.join(tmp, '.ai', 'skills', 'plan-review'), { recursive: true });
    await fs.writeFile(
      path.join(tmp, '.ai', 'skills', 'plan-review', 'SKILL.md'),
      '# S',
    );
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.cursor/skills/plan-review/SKILL.md'), 'utf-8')).toMatch(
      /S/,
    );
  });

  it('generateCursor writes lifecycle rule when lifecycle content exists', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-cur-life-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.mkdir(path.join(tmp, '.ai', 'lifecycle'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'x.md'), '# R');
    await fs.writeFile(path.join(tmp, '.ai', 'lifecycle', 'plan.md'), '# Plan life');
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    const lifecycle = await fs.readFile(path.join(tmp, '.cursor/rules/lifecycle.mdc'), 'utf-8');
    expect(lifecycle).toMatch(/Plan life/);
  });

  it('generateCursor assigns globs for all specialized rule basenames', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-cur-allglobs-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    const names = [
      'state-management',
      'data-fetching',
      'forms-validation',
      'routing',
    ] as const;
    for (const n of names) {
      await fs.writeFile(path.join(tmp, '.ai', 'rules', `${n}.md`), `# ${n}`);
    }
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    const sm = await fs.readFile(path.join(tmp, '.cursor/rules/state-management.mdc'), 'utf-8');
    expect(sm).toContain('globs: "src/store/**/*,src/stores/**/*,**/*.store.ts,**/*.slice.ts"');
    expect(sm).toMatch(/src\/store/);
    const df = await fs.readFile(path.join(tmp, '.cursor/rules/data-fetching.mdc'), 'utf-8');
    expect(df).toContain('globs: "src/api/**/*,src/hooks/use*.ts,src/composables/**/*,src/services/**/*"');
    expect(df).toMatch(/composables/);
    const fv = await fs.readFile(path.join(tmp, '.cursor/rules/forms-validation.mdc'), 'utf-8');
    expect(fv).toContain('globs: "**/*.schema.ts,src/forms/**/*,**/*.form.tsx"');
    expect(fv).toMatch(/\.schema\.ts/);
    const rt = await fs.readFile(path.join(tmp, '.cursor/rules/routing.mdc'), 'utf-8');
    expect(rt).toContain('globs: "src/routes/**/*,src/pages/**/*,app/routes/**/*,src/app/**/*"');
    expect(rt).toMatch(/src\/routes/);
  });

  it('generateCursor styling and seo-meta globs', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-cur-glob-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'styling.md'), '# S');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'seo-meta.md'), '# SEO');
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    const styling = await fs.readFile(path.join(tmp, '.cursor/rules/styling.mdc'), 'utf-8');
    expect(styling).toContain('globs: "**/*.css,**/*.scss,**/*.module.css,**/*.styled.ts,tailwind.config.*"');
    expect(styling).toMatch(/tailwind\.config/);
    const seo = await fs.readFile(path.join(tmp, '.cursor/rules/seo-meta.mdc'), 'utf-8');
    expect(seo).toContain('globs: "src/pages/**/*,app/**/*.tsx,**/*.head.tsx,next-seo.config.*"');
    expect(seo).toMatch(/next-seo/);
  });

  it('generateAntigravity skips non-directories and dirs without SKILL.md', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-anti-'));
    await fs.mkdir(path.join(tmp, '.ai', 'skills'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 'readme.txt'), 'x');
    await fs.mkdir(path.join(tmp, '.ai', 'skills', 'empty-skill'), { recursive: true });
    await fs.mkdir(path.join(tmp, '.ai', 'skills', 'ok-skill'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 'ok-skill', 'SKILL.md'), '# OK');
    const writer = new FileWriter(tmp);
    await generateAntigravity(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.agents/workflows/ok-skill.md'), 'utf-8')).toMatch(
      /OK/,
    );
    const names = await fs.readdir(path.join(tmp, '.agents/workflows'));
    expect(names).toEqual(['ok-skill.md']);
  });

  it('generateAntigravity no-op when skills dir missing', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-anti-miss-'));
    await fs.mkdir(path.join(tmp, '.ai'), { recursive: true });
    const writer = new FileWriter(tmp);
    await generateAntigravity(tmp, writer);
    await expect(fs.access(path.join(tmp, '.agents'))).rejects.toThrow();
  });

  it('generateCursor skips non-.md files in rules', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-cur-md-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'only.txt'), 'x');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'keep.md'), '# K');
    const writer = new FileWriter(tmp);
    await generateCursor(tmp, writer);
    const keep = await fs.readFile(path.join(tmp, '.cursor/rules/keep.mdc'), 'utf-8');
    expect(keep).toMatch(/K/);
  });

  it('generateClaudeCode merges rules and copies skill files', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-claude-full-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# Agent');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'skip.bin'), '');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'rule.md'), '# Rule body');
    await fs.mkdir(path.join(tmp, '.ai', 'skills'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 'not-a-folder'), 'skip');
    await fs.mkdir(path.join(tmp, '.ai', 'skills', 's1'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 's1', 'SKILL.md'), '# S');
    await fs.writeFile(path.join(tmp, '.ai', 'skills', 's1', 'extra.md'), '# E');
    const writer = new FileWriter(tmp);
    await generateClaudeCode(tmp, writer);
    const claude = await fs.readFile(path.join(tmp, 'CLAUDE.md'), 'utf-8');
    expect(claude).toMatch(/Agent/);
    expect(claude).toMatch(/Rule body/);
    expect(await fs.readFile(path.join(tmp, '.claude/skills/s1/SKILL.md'), 'utf-8')).toMatch(/S/);
    expect(await fs.readFile(path.join(tmp, '.claude/skills/s1/extra.md'), 'utf-8')).toMatch(/E/);
  });

  it('generateVsCodeCopilot skips non-.md in rules', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-vsc-skip-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'x.txt'), 'nope');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'r.md'), '# R');
    const writer = new FileWriter(tmp);
    await generateVsCodeCopilot(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.github/copilot-instructions.md'), 'utf-8')).toMatch(
      /R/,
    );
  });

  it('generateWindsurf skips non-.md in rules', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-ws-skip-'));
    await fs.mkdir(path.join(tmp, '.ai', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmp, '.ai', 'AGENT.md'), '# A');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'bad.exe'), '');
    await fs.writeFile(path.join(tmp, '.ai', 'rules', 'good.md'), '# G');
    const writer = new FileWriter(tmp);
    await generateWindsurf(tmp, writer);
    expect(await fs.readFile(path.join(tmp, '.windsurfrules'), 'utf-8')).toMatch(/G/);
  });
});

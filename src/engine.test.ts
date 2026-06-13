import { describe, it, expect, beforeAll, vi } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { TemplateEngine } from './engine.js';
import { buildContext } from './context-builder.js';
import type { UserAnswers } from './types.js';

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function minimalContext() {
  const answers: UserAnswers = {
    projectName: 't',
    projectDescription: 'd',
    uiFramework: 'react',
    metaFramework: 'none',
    language: 'typescript',
    styling: 'tailwind',
    componentLibrary: 'none',
    stateManagement: 'none',
    dataFetching: 'none',
    formHandling: 'none',
    componentDocs: 'none',
    auth: 'none',
    testFramework: 'vitest',
    e2eFramework: 'none',
    monitoring: [],
    cicd: 'github-actions',
    ideTargets: [],
  };
  return buildContext(answers);
}

describe('TemplateEngine', () => {
  let engine: TemplateEngine;

  beforeAll(async () => {
    engine = new TemplateEngine(pkgRoot);
    await engine.initialize();
  });

  it('renders agent.hbs with non-empty output', async () => {
    const out = await engine.render('agent.hbs', minimalContext());
    expect(out.length).toBeGreaterThan(50);
    expect(out).toMatch(/AI|agent|react|project/i);
  });

  it('renders architecture with partials', async () => {
    const out = await engine.render('rules/architecture.hbs', minimalContext());
    expect(out.length).toBeGreaterThan(20);
    expect(out).toMatch(/Architecture|components/i);
  });

  it('registerHelpers: or, and, includes with null array', async () => {
    await engine.initialize();
    const t = Handlebars.compile(
      '{{or a b}}|{{and c d}}|{{and c d z}}|{{includes items "z"}}',
    );
    expect(
      t({ a: false, b: true, c: true, d: true, z: false, items: ['a'] }),
    ).toBe('true|true|false|false');
    expect(Handlebars.compile('{{includes items "a"}}')({ items: ['a', 'b'] })).toBe(
      'true',
    );
    expect(Handlebars.compile('{{includes arr "x"}}')({ arr: null })).toBe('');
    expect(
      Handlebars.compile('{{eq x y}}|{{neq x z}}')({ x: 1, y: 1, z: 2 }),
    ).toBe('true|true');
  });

  it('registerPartials warns when partials directory is missing', async () => {
    const base = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-eng-'));
    await fs.mkdir(path.join(base, 'templates'), { recursive: true });
    await fs.writeFile(path.join(base, 'templates', 'x.hbs'), 'ok');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const eng = new TemplateEngine(base);
    await eng.initialize();
    expect(warn).toHaveBeenCalledWith('Could not load partials:', expect.anything());
    warn.mockRestore();
    const out = await eng.render('x.hbs', minimalContext());
    expect(out).toBe('ok');
  });

  it('registerPartials ignores non-.hbs files in partials dir', async () => {
    const base = await fs.mkdtemp(path.join(os.tmpdir(), 'fare-eng-part-'));
    const partials = path.join(base, 'templates', 'partials');
    await fs.mkdir(partials, { recursive: true });
    await fs.writeFile(path.join(partials, 'note.txt'), 'skip');
    await fs.writeFile(path.join(partials, 'buildCommands.hbs'), 'partial-body');
    await fs.mkdir(path.join(base, 'templates'), { recursive: true });
    await fs.writeFile(path.join(base, 'templates', 't.hbs'), '{{> buildCommands}}');
    const eng = new TemplateEngine(base);
    await eng.initialize();
    const out = await eng.render('t.hbs', minimalContext());
    expect(out).toContain('partial-body');
  });
});

import { describe, it, expect } from 'vitest';
import {
  BANNER_TITLE,
  INNER_WIDTH,
  boxLine,
  renderStartupBanner,
  renderGenerationSummary,
} from './banner.js';
import type { WriteResult } from './types.js';

describe('BANNER_TITLE', () => {
  it('uses the binding Fare casing (lowercase i + starter, capital RE)', () => {
    expect(BANNER_TITLE).toBe('Fare — Frontend Ai starter REcipes');
  });
});

describe('boxLine', () => {
  it('pads content to INNER_WIDTH between rails', () => {
    const line = boxLine('  hello');
    expect(line.startsWith('│')).toBe(true);
    expect(line.endsWith('│')).toBe(true);
    expect(line.length).toBe(INNER_WIDTH + 2);
  });

  it('truncates overflow with ellipsis', () => {
    const long = 'x'.repeat(INNER_WIDTH + 20);
    const line = boxLine(long);
    expect(line.length).toBe(INNER_WIDTH + 2);
    expect(line).toContain('…');
  });
});

describe('renderStartupBanner', () => {
  it('includes title, version, description, and docs URL', () => {
    const out = renderStartupBanner({
      title: BANNER_TITLE,
      version: '1.2.0',
      description: ['Line one.', 'Line two.'],
      docsUrl: 'https://example.com/docs/',
    });
    expect(out).toContain(BANNER_TITLE);
    expect(out).toContain('v1.2.0');
    expect(out).toContain('Line one.');
    expect(out).toContain('Line two.');
    expect(out).toContain('Docs: https://example.com/docs/');
    expect(out.split('\n').every((l) => l.length === INNER_WIDTH + 2)).toBe(true);
  });

  it('truncates long docs URL with ellipsis', () => {
    const longUrl = 'https://' + 'a'.repeat(INNER_WIDTH + 20) + '.example.com/';
    const out = renderStartupBanner({
      title: BANNER_TITLE,
      version: '1.2.0',
      description: ['x', 'y'],
      docsUrl: longUrl,
    });
    expect(out).toContain('…');
    expect(out.split('\n').every((l) => l.length === INNER_WIDTH + 2)).toBe(true);
  });
});

describe('renderGenerationSummary', () => {
  const results: WriteResult[] = [
    { path: '.cursor/rules/index.mdc', status: 'created' },
    { path: '.cursor/rules/architecture.mdc', status: 'backed-up' },
  ];

  it('renders Generated for header, adapter group, totals, and Next Steps', () => {
    const out = renderGenerationSummary({
      outputDir: '/tmp/x',
      projectLabel: 'my-frontend  (react-nextjs-tailwind)',
      byAdapter: { cursor: results },
      ideTargets: ['cursor'],
      docsUrl: 'https://example.com/docs/',
    });
    expect(out).toContain('Generated for: my-frontend  (react-nextjs-tailwind)');
    expect(out).toContain('Adapter: Cursor');
    expect(out).toContain('✔ Created  .cursor/rules/index.mdc');
    expect(out).toContain('◈ Backed up  .cursor/rules/architecture.mdc');
    expect(out).toContain('2 files written  (1 created, 1 backed up, 0 skipped, 0 overwritten)');
    expect(out).toContain('Think → Plan → Build → Review → Test → Ship → Reflect');
    expect(out).toContain('--write-mode overwrite');
    expect(out).toContain('Docs → https://example.com/docs/');
  });

  it('prints Next Steps lines only for selected adapters', () => {
    const out = renderGenerationSummary({
      outputDir: '/tmp/x',
      projectLabel: 'p',
      byAdapter: { cursor: results, 'claude-code': results },
      ideTargets: ['cursor', 'claude-code'],
      docsUrl: 'https://example.com/',
    });
    expect(out).toContain('In Cursor: type /think');
    expect(out).toContain('In Claude Code: run /think');
    expect(out).not.toContain('In Copilot:');
    expect(out).not.toContain('In Windsurf:');
    expect(out).not.toContain('In Antigravity:');
  });

  it('includes Antigravity Next Steps line when selected', () => {
    const out = renderGenerationSummary({
      outputDir: '/tmp/x',
      projectLabel: 'p',
      byAdapter: { antigravity: results },
      ideTargets: ['antigravity'],
      docsUrl: 'https://example.com/',
    });
    expect(out).toContain('In Antigravity: lifecycle workflows are in .agents/workflows/<stage>.md.');
  });

  it('iterates adapters in ideTargets order', () => {
    const out = renderGenerationSummary({
      outputDir: '/tmp/x',
      projectLabel: 'p',
      byAdapter: { windsurf: results, cursor: results },
      ideTargets: ['windsurf', 'cursor'],
      docsUrl: 'https://example.com/',
    });
    const wIdx = out.indexOf('Adapter: Windsurf');
    const cIdx = out.indexOf('Adapter: Cursor');
    expect(wIdx).toBeGreaterThan(-1);
    expect(cIdx).toBeGreaterThan(wIdx);
  });
});

/**
 * CLI startup banner + post-generation summary renderers.
 *
 * `BANNER_TITLE` is the canonical "Fare — Frontend Ai starter REcipes" string used by
 * `src/cli.ts` on launch. WP-H consumes it to build the full boxed banner with version
 * + docs URL, and renders the post-generation summary with per-adapter file groups
 * and IDE-keyed next-steps lines.
 *
 * Casing rule (binding per workspace memory `feedback-fare-bare-acronym-casing`):
 * - `Frontend Ai starter REcipes` — lowercase `i`, lowercase `starter`, capital `RE`.
 * - Acronym letters form FARE: F-A-RE.
 *
 * @module banner
 */
import type { WriteResult, WriteStatus } from './types.js';

export const BANNER_TITLE = 'Fare — Frontend Ai starter REcipes';

/** Inner content width between box rails. Total box width = INNER_WIDTH + 2 = 59 cols. */
export const INNER_WIDTH = 57;

const TOP = `╭${'─'.repeat(INNER_WIDTH)}╮`;
const BOTTOM = `╰${'─'.repeat(INNER_WIDTH)}╯`;

/** Returns `│ <content padded to INNER_WIDTH> │`. Truncates with `…` when content overflows. */
export function boxLine(content: string): string {
  if (content.length > INNER_WIDTH) {
    content = content.slice(0, INNER_WIDTH - 1) + '…';
  }
  return `│${content.padEnd(INNER_WIDTH)}│`;
}

export interface StartupBannerInput {
  title: string;
  version: string;
  description: [string, string];
  docsUrl: string;
}

/** Renders the boxed startup block (title + description) with the docs URL as plain text below the box. */
export function renderStartupBanner(input: StartupBannerInput): string {
  const titleLine = `  ${input.title}  v${input.version}`;
  return [
    TOP,
    boxLine(titleLine),
    boxLine(`  ${input.description[0]}`),
    boxLine(`  ${input.description[1]}`),
    BOTTOM,
    `  Docs: ${input.docsUrl}`,
  ].join('\n');
}

export interface GenerationSummaryInput {
  outputDir: string;
  projectLabel: string;
  byAdapter: Record<string, WriteResult[]>;
  ideTargets: string[];
  docsUrl: string;
}

const STATUS_GLYPH: Record<WriteStatus, string> = {
  created: '✔ Created',
  'backed-up': '◈ Backed up',
  skipped: '↷ Skipped',
  overwritten: '↺ Overwritten',
};

export const ADAPTER_NAMES: Record<string, string> = {
  cursor: 'Cursor',
  'claude-code': 'Claude Code',
  'vscode-copilot': 'VS Code Copilot',
  antigravity: 'Antigravity',
  windsurf: 'Windsurf',
};

const IDE_NEXT_STEPS: Record<string, string> = {
  cursor: '→ In Cursor: type /think in Agent chat to begin planning.',
  'claude-code': '→ In Claude Code: run /think from the command palette.',
  'vscode-copilot':
    '→ In Copilot: reference the lifecycle sections in copilot-instructions.md.',
  windsurf: '→ In Windsurf: lifecycle stages are in .windsurf/rules/lifecycle-*.md.',
  antigravity:
    '→ In Antigravity: lifecycle workflows are in .agents/workflows/<stage>.md.',
};

/** Renders the boxed `Generated for` header + per-adapter groups + boxed Summary/Next Steps footer.
 *  Both boxes share a single dynamic width derived from the widest piece of content. */
export function renderGenerationSummary(input: GenerationSummaryInput): string {
  const headerLabel = `  Generated for: ${input.projectLabel}`;

  let total = 0;
  const totals: Record<WriteStatus, number> = {
    created: 0,
    'backed-up': 0,
    skipped: 0,
    overwritten: 0,
  };

  const adapterLines: string[] = [];
  for (const adapter of input.ideTargets) {
    const results = input.byAdapter[adapter] ?? [];
    if (results.length === 0) continue;
    adapterLines.push(`  Adapter: ${ADAPTER_NAMES[adapter] ?? adapter}`);
    for (const r of results) {
      adapterLines.push(`  ${STATUS_GLYPH[r.status]}  ${r.path}`);
      totals[r.status] += 1;
      total += 1;
    }
    adapterLines.push('');
  }

  const footer: string[] = [];
  footer.push(
    `Summary: ${total} files written  (${totals.created} created, ${totals['backed-up']} backed up, ${totals.skipped} skipped, ${totals.overwritten} overwritten)`,
  );
  footer.push('');
  footer.push('Next steps');
  footer.push('');
  footer.push('1. Open your project in your IDE');
  footer.push('   → Your IDE will load the generated rules automatically.');
  footer.push('');
  footer.push('2. Start a task using the lifecycle');
  for (const adapter of input.ideTargets) {
    const step = IDE_NEXT_STEPS[adapter];
    if (step) footer.push(`   ${step}`);
  }
  footer.push('');
  footer.push('3. The 7 lifecycle stages guide your AI through every feature:');
  footer.push('   Think → Plan → Build → Review → Test → Ship → Reflect');
  footer.push('');
  footer.push('4. Re-running this CLI will back up existing files automatically.');
  footer.push('   Use --write-mode overwrite to skip backups.');
  footer.push('');
  footer.push(`Docs → ${input.docsUrl}`);

  // Unified inner width: widest of header label, footer lines, or startup banner width.
  const innerW = Math.max(INNER_WIDTH, headerLabel.length, ...footer.map((l) => l.length));
  const boxTop = `╭${'─'.repeat(innerW + 2)}╮`;
  const boxBot = `╰${'─'.repeat(innerW + 2)}╯`;
  const row = (s: string) => `│ ${s.padEnd(innerW)} │`;

  const lines: string[] = [];
  lines.push(boxTop);
  lines.push(row(headerLabel));
  lines.push(boxBot);
  lines.push('');
  lines.push(...adapterLines);
  lines.push(boxTop);
  for (const l of footer) lines.push(row(l));
  lines.push(boxBot);

  return lines.join('\n');
}

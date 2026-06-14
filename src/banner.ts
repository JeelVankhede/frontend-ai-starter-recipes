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

/** Renders the 6-line boxed startup block (top + title + 2× description + blank + docs + bottom). */
export function renderStartupBanner(input: StartupBannerInput): string {
  const titleLine = `  ${input.title}  v${input.version}`;
  const docsLine = formatDocsLine(input.docsUrl);
  return [
    TOP,
    boxLine(titleLine),
    boxLine(`  ${input.description[0]}`),
    boxLine(`  ${input.description[1]}`),
    boxLine(''),
    boxLine(docsLine),
    BOTTOM,
  ].join('\n');
}

function formatDocsLine(url: string): string {
  const prefix = '  Docs: ';
  const budget = INNER_WIDTH - prefix.length;
  if (url.length <= budget) return `${prefix}${url}`;
  return `${prefix}${url.slice(0, budget - 1)}…`;
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

const ADAPTER_NAMES: Record<string, string> = {
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

/** Renders the boxed `Generated for` header + per-adapter groups + totals + Next Steps block. */
export function renderGenerationSummary(input: GenerationSummaryInput): string {
  const lines: string[] = [];
  lines.push(TOP);
  lines.push(boxLine(`  Generated for: ${input.projectLabel}`));
  lines.push(BOTTOM);
  lines.push('');

  let total = 0;
  const totals: Record<WriteStatus, number> = {
    created: 0,
    'backed-up': 0,
    skipped: 0,
    overwritten: 0,
  };

  for (const adapter of input.ideTargets) {
    const results = input.byAdapter[adapter] ?? [];
    if (results.length === 0) continue;
    lines.push(`  Adapter: ${ADAPTER_NAMES[adapter] ?? adapter}`);
    for (const r of results) {
      lines.push(`  ${STATUS_GLYPH[r.status]}  ${r.path}`);
      totals[r.status] += 1;
      total += 1;
    }
    lines.push('');
  }

  lines.push(
    `  Summary: ${total} files written  (${totals.created} created, ${totals['backed-up']} backed up, ${totals.skipped} skipped, ${totals.overwritten} overwritten)`,
  );
  lines.push('');
  lines.push('─'.repeat(60));
  lines.push('');
  lines.push('  Next steps');
  lines.push('');
  lines.push('  1. Open your project in your IDE');
  lines.push('     → Your IDE will load the generated rules automatically.');
  lines.push('');
  lines.push('  2. Start a task using the lifecycle');
  for (const adapter of input.ideTargets) {
    const step = IDE_NEXT_STEPS[adapter];
    if (step) lines.push(`     ${step}`);
  }
  lines.push('');
  lines.push('  3. The 7 lifecycle stages guide your AI through every feature:');
  lines.push('     Think → Plan → Build → Review → Test → Ship → Reflect');
  lines.push('');
  lines.push('  4. Re-running this CLI will back up existing files automatically.');
  lines.push('     Use --write-mode overwrite to skip backups.');
  lines.push('');
  lines.push(`  Docs → ${input.docsUrl}`);

  return lines.join('\n');
}

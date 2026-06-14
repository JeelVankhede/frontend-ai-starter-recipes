/**
 * Shared utilities for adapter rewrites. Used by cursor / claude-code / vscode-copilot /
 * windsurf / antigravity adapters. Adapters consume `RenderedContext`, not the filesystem.
 * @module adapters/helpers
 */

/** Strip a leading `---\n...\n---\n+` YAML frontmatter block, if present. */
export function removeFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n+/, '');
}

/**
 * Extract the `description:` value from a rendered rule's frontmatter.
 * Returns an empty string when the frontmatter is missing or has no `description:` line.
 */
export function extractDescription(content: string): string {
  const match = content.match(/^---\s*\n[\s\S]*?^description:\s*(.+?)\s*$/m);
  if (!match) return '';
  return match[1].trim();
}

/** Format an array of glob patterns into a YAML `globs:` block (multi-line, JSON-quoted values). */
export function formatGlobs(patterns: string[]): string {
  return ['globs:', ...patterns.map((p) => `  - ${JSON.stringify(p)}`)].join('\n');
}

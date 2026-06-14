/**
 * Per-rule Cursor `.mdc` frontmatter directive map for Fare v1.2.
 * Transcribed from blueprints' "Target Output Path" sections in
 * `engineering-research-repo/04-fare-ready/rules/<rule>.md`. The Cursor
 * adapter consumes this verbatim; rule description comes from the rendered
 * template's own frontmatter (set by WP-D from blueprint Purpose).
 *
 * Update protocol: when a Fare blueprint's Cursor directive changes,
 * update this map and re-run the build verification grep.
 *
 * @module rule-cursor-metadata
 */

export type CursorRuleMeta =
  | { alwaysApply: true }
  | { alwaysApply: false }
  | { globs: string[] };

export const RULE_CURSOR_METADATA: Record<string, CursorRuleMeta> = {
  architecture: { alwaysApply: true },
  components: {
    globs: ['**/*.tsx', '**/*.vue', '**/*.svelte', 'src/components/**/*'],
  },
  'styling-accessibility': {
    globs: ['**/*.css', '**/*.scss', '**/*.module.css', '**/*.styled.ts', 'tailwind.config.*'],
  },
  'state-and-data-fetching': {
    globs: [
      'src/store/**/*',
      'src/stores/**/*',
      '**/*.store.ts',
      '**/*.slice.ts',
      'src/api/**/*',
      'src/hooks/use*.ts',
      'src/composables/**/*',
      'src/services/**/*',
    ],
  },
  'performance-and-testing': {
    globs: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      'cypress/**/*',
      'e2e/**/*',
    ],
  },
  routing: {
    globs: ['src/routes/**/*', 'src/pages/**/*', 'app/routes/**/*', 'src/app/**/*'],
  },
  'forms-validation': {
    globs: ['**/*.schema.ts', 'src/forms/**/*', '**/*.form.tsx'],
  },
  'seo-meta': {
    globs: ['src/pages/**/*', 'app/**/*.tsx', '**/*.head.tsx', 'next-seo.config.*'],
  },
  'errors-logging': { alwaysApply: true },
  security: { alwaysApply: true },
  environment: {
    globs: ['.env*', 'src/config/**/*', 'vite.config.*', 'next.config.*'],
  },
  'git-conventions': { alwaysApply: false },
  'pre-commit': { alwaysApply: false },
};

/**
 * Shared helpers for reading canonical `.ai/lifecycle/` files for adapters.
 * @module adapters/lifecycle
 */
import fs from 'fs/promises';
import path from 'path';

const LIFECYCLE_STAGES = ['think', 'plan', 'build', 'review', 'test', 'ship', 'reflect'] as const;

export function removeFrontmatter(content: string) {
  return content.replace(/^---\n[\s\S]*?\n---\n+/, '');
}

export async function readLifecycleContent(aiDir: string): Promise<string> {
  const lifecycleDir = path.join(aiDir, 'lifecycle');
  let mergedContent = '';

  for (const stage of LIFECYCLE_STAGES) {
    try {
      const content = await fs.readFile(path.join(lifecycleDir, `${stage}.md`), 'utf-8');
      mergedContent += `# Lifecycle: ${stage}\n\n${removeFrontmatter(content)}\n\n`;
    } catch {
      /* lifecycle stage missing */
    }
  }

  return mergedContent;
}

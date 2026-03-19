import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  select: vi.fn(),
  checkbox: vi.fn(),
}));

import { input, select, checkbox } from '@inquirer/prompts';
import { askQuestions } from './prompts.js';

function mockSelectChain() {
  vi.mocked(select)
    .mockResolvedValueOnce('react')
    .mockResolvedValueOnce('none')
    .mockResolvedValueOnce('typescript')
    .mockResolvedValueOnce('tailwind')
    .mockResolvedValueOnce('shadcn')
    .mockResolvedValueOnce('zustand')
    .mockResolvedValueOnce('tanstack-query')
    .mockResolvedValueOnce('react-hook-form')
    .mockResolvedValueOnce('storybook')
    .mockResolvedValueOnce('none')
    .mockResolvedValueOnce('vitest')
    .mockResolvedValueOnce('playwright')
    .mockResolvedValueOnce('github-actions');
}

describe('askQuestions', () => {
  beforeEach(() => {
    vi.mocked(input).mockReset();
    vi.mocked(select).mockReset();
    vi.mocked(checkbox).mockReset();
  });

  it('returns UserAnswers matching mocked selections', async () => {
    vi.mocked(input).mockResolvedValueOnce('proj-x').mockResolvedValueOnce('desc-x');
    mockSelectChain();
    vi.mocked(checkbox)
      .mockResolvedValueOnce(['sentry'])
      .mockResolvedValueOnce(['cursor'])
      .mockResolvedValueOnce(['plan-review']);
    const answers = await askQuestions();
    expect(answers.projectName).toBe('proj-x');
    expect(answers.uiFramework).toBe('react');
    expect(answers.ideTargets).toEqual(['cursor']);
    expect(answers.skills).toEqual(['plan-review']);
  });

  it('expands ideTargets when all is selected', async () => {
    vi.mocked(input).mockResolvedValueOnce('p').mockResolvedValueOnce('d');
    mockSelectChain();
    vi.mocked(checkbox)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(['all'])
      .mockResolvedValueOnce(['plan-review']);
    const answers = await askQuestions();
    expect(answers.ideTargets).toEqual([
      'cursor',
      'claude-code',
      'vscode-copilot',
      'antigravity',
      'windsurf',
    ]);
  });

  it('expands skills when all is selected', async () => {
    vi.mocked(input).mockResolvedValueOnce('p').mockResolvedValueOnce('d');
    mockSelectChain();
    vi.mocked(checkbox)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(['cursor'])
      .mockResolvedValueOnce(['all']);
    const answers = await askQuestions();
    expect(answers.skills).toContain('performance-audit');
    expect(answers.skills).toContain('dependency-audit');
  });
});

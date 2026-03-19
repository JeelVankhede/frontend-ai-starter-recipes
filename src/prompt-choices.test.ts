import { describe, it, expect } from 'vitest';
import {
  metaFrameworkChoices,
  componentLibraryChoices,
  stateManagementChoices,
  dataFetchingChoices,
  formHandlingChoices,
} from './prompt-choices.js';
import type { UiFramework } from './prompt-choices.js';

const frameworks: UiFramework[] = ['react', 'vue', 'svelte', 'angular', 'solid', 'preact'];

describe('prompt-choices', () => {
  it.each(frameworks)('metaFrameworkChoices(%s) returns non-empty', (ui) => {
    const c = metaFrameworkChoices(ui);
    expect(c.length).toBeGreaterThan(0);
    expect(c.every((x) => x.value)).toBe(true);
  });

  it.each(frameworks)('componentLibraryChoices(%s) returns non-empty', (ui) => {
    expect(componentLibraryChoices(ui).length).toBeGreaterThan(0);
  });

  it.each(frameworks)('stateManagementChoices(%s) returns non-empty', (ui) => {
    expect(stateManagementChoices(ui).length).toBeGreaterThan(0);
  });

  it.each(frameworks)('dataFetchingChoices(%s) returns non-empty', (ui) => {
    expect(dataFetchingChoices(ui).length).toBeGreaterThan(0);
  });

  it.each(frameworks)('formHandlingChoices(%s) returns non-empty', (ui) => {
    expect(formHandlingChoices(ui).length).toBeGreaterThan(0);
  });

  it('react meta includes nextjs', () => {
    const values = metaFrameworkChoices('react').map((x) => x.value);
    expect(values).toContain('nextjs');
  });

  it('angular meta is only none', () => {
    expect(metaFrameworkChoices('angular')).toEqual([
      { name: 'None (Angular CLI is the app shell)', value: 'none' },
    ]);
  });
});

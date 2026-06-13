import { describe, it, expect } from 'vitest';
import { buildContext } from './context-builder.js';
import type { UserAnswers } from './types.js';

function base(overrides: Partial<UserAnswers> = {}): UserAnswers {
  return {
    projectName: 'app',
    projectDescription: 'desc',
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
    ideTargets: ['cursor'],
    ...overrides,
  };
}

describe('buildContext', () => {
  it('react + vite defaults', () => {
    const ctx = buildContext(base());
    expect(ctx.buildCommand).toBe('vite build');
    expect(ctx.devCommand).toBe('vite dev');
    expect(ctx.testCommand).toBe('npx vitest run');
    expect(ctx.e2eCommand).toBe('');
    expect(ctx.isReact).toBe(true);
    expect(ctx.hasTailwind).toBe(true);
    expect(ctx.componentDir).toBe('src/components');
  });

  it('nextjs commands and paths', () => {
    const ctx = buildContext(base({ metaFramework: 'nextjs' }));
    expect(ctx.buildCommand).toBe('next build');
    expect(ctx.devCommand).toBe('next dev');
    expect(ctx.isNextJS).toBe(true);
    expect(ctx.hasMetaFramework).toBe(true);
    expect(ctx.componentDir).toBe('components');
    expect(ctx.pagesDir).toBe('app/');
  });

  it('remix commands', () => {
    const ctx = buildContext(base({ metaFramework: 'remix' }));
    expect(ctx.buildCommand).toBe('npx remix vite:build');
    expect(ctx.devCommand).toBe('npx remix vite:dev');
  });

  it('nuxt commands and pagesDir', () => {
    const ctx = buildContext(base({ uiFramework: 'vue', metaFramework: 'nuxt' }));
    expect(ctx.buildCommand).toBe('nuxi build');
    expect(ctx.devCommand).toBe('nuxi dev');
    expect(ctx.pagesDir).toBe('pages/');
  });

  it('sveltekit', () => {
    const ctx = buildContext(base({ uiFramework: 'svelte', metaFramework: 'sveltekit' }));
    expect(ctx.pagesDir).toBe('src/routes/');
  });

  it('astro', () => {
    const ctx = buildContext(base({ uiFramework: 'solid', metaFramework: 'astro' }));
    expect(ctx.buildCommand).toBe('astro build');
    expect(ctx.devCommand).toBe('astro dev');
  });

  it('angular commands and paths', () => {
    const ctx = buildContext(base({ uiFramework: 'angular', metaFramework: 'none' }));
    expect(ctx.buildCommand).toBe('ng build');
    expect(ctx.devCommand).toBe('ng serve');
    expect(ctx.componentDir).toBe('src/app/components');
    expect(ctx.pagesDir).toBe('src/app/');
  });

  it('jest test command', () => {
    expect(buildContext(base({ testFramework: 'jest' })).testCommand).toBe('npm run test');
  });

  it('angular jest uses ng test', () => {
    expect(
      buildContext(
        base({ uiFramework: 'angular', metaFramework: 'none', testFramework: 'jest' }),
      ).testCommand,
    ).toBe('ng test --watch=false');
  });

  it('e2e commands', () => {
    expect(buildContext(base({ e2eFramework: 'playwright' })).e2eCommand).toBe(
      'npx playwright test',
    );
    expect(buildContext(base({ e2eFramework: 'cypress' })).e2eCommand).toBe('npx cypress run');
  });

  it('storeDir for zustand pinia ngrx', () => {
    expect(buildContext(base({ stateManagement: 'zustand' })).storeDir).toBe('src/stores');
    expect(buildContext(base({ uiFramework: 'vue', stateManagement: 'pinia' })).storeDir).toBe(
      'src/stores',
    );
    expect(
      buildContext(base({ uiFramework: 'angular', stateManagement: 'ngrx' })).storeDir,
    ).toBe('src/app/store');
    expect(buildContext(base({ stateManagement: 'redux-toolkit' })).storeDir).toBe('src/store');
  });

  it('feature flags', () => {
    const ctx = buildContext(
      base({
        styling: 'emotion',
        stateManagement: 'redux-toolkit',
        dataFetching: 'swr',
        formHandling: 'formik',
        componentLibrary: 'mui',
        componentDocs: 'storybook',
        auth: 'session',
        e2eFramework: 'cypress',
      }),
    );
    expect(ctx.hasCSSInJS).toBe(true);
    expect(ctx.hasRedux).toBe(true);
    expect(ctx.hasSWR).toBe(true);
    expect(ctx.hasFormik).toBe(true);
    expect(ctx.hasMUI).toBe(true);
    expect(ctx.hasStorybook).toBe(true);
    expect(ctx.hasAuth).toBe(true);
    expect(ctx.hasCypress).toBe(true);
  });
});

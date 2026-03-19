/**
 * Maps interactive or preset {@link UserAnswers} into {@link TemplateContext}.
 * @module context-builder
 */
import type { UserAnswers, TemplateContext } from './types.js';

/**
 * Builds the Handlebars context used by all templates.
 */
export function buildContext(answers: UserAnswers): TemplateContext {
  const { metaFramework, uiFramework, styling, stateManagement, dataFetching, formHandling } = answers;

  const hasMetaFramework = metaFramework !== 'none';

  let buildCommand = 'vite build';
  let devCommand = 'vite dev';

  if (metaFramework === 'nextjs') {
    buildCommand = 'next build';
    devCommand = 'next dev';
  } else if (metaFramework === 'remix') {
    buildCommand = 'npx remix vite:build';
    devCommand = 'npx remix vite:dev';
  } else if (metaFramework === 'nuxt') {
    buildCommand = 'nuxi build';
    devCommand = 'nuxi dev';
  } else if (metaFramework === 'sveltekit') {
    buildCommand = 'vite build';
    devCommand = 'vite dev';
  } else if (metaFramework === 'astro') {
    buildCommand = 'astro build';
    devCommand = 'astro dev';
  } else if (uiFramework === 'angular') {
    buildCommand = 'ng build';
    devCommand = 'ng serve';
  }

  const lintCommand = 'npm run lint';

  let testCommand = answers.testFramework === 'vitest' ? 'npx vitest run' : 'npm run test';
  if (uiFramework === 'angular' && answers.testFramework === 'jest') {
    testCommand = 'ng test --watch=false';
  }

  let e2eCommand = '';
  if (answers.e2eFramework === 'playwright') {
    e2eCommand = 'npx playwright test';
  } else if (answers.e2eFramework === 'cypress') {
    e2eCommand = 'npx cypress run';
  }

  let componentDir = 'src/components';
  if (metaFramework === 'nextjs') {
    componentDir = 'components';
  } else if (uiFramework === 'angular') {
    componentDir = 'src/app/components';
  }

  let pagesDir = 'src/pages';
  if (metaFramework === 'nextjs') {
    pagesDir = 'app/';
  } else if (metaFramework === 'nuxt') {
    pagesDir = 'pages/';
  } else if (metaFramework === 'sveltekit') {
    pagesDir = 'src/routes/';
  } else if (uiFramework === 'angular') {
    pagesDir = 'src/app/';
  }

  let storeDir = 'src/store';
  if (stateManagement === 'zustand' || stateManagement === 'pinia') {
    storeDir = 'src/stores';
  } else if (stateManagement === 'ngrx') {
    storeDir = 'src/app/store';
  }

  return {
    ...answers,

    isReact: uiFramework === 'react',
    isVue: uiFramework === 'vue',
    isSvelte: uiFramework === 'svelte',
    isAngular: uiFramework === 'angular',
    isSolid: uiFramework === 'solid',
    isPreact: uiFramework === 'preact',

    isNextJS: metaFramework === 'nextjs',
    isRemix: metaFramework === 'remix',
    isNuxt: metaFramework === 'nuxt',
    isSvelteKit: metaFramework === 'sveltekit',
    isAstro: metaFramework === 'astro',
    hasMetaFramework,

    hasTailwind: styling === 'tailwind',
    hasCSSModules: styling === 'css-modules',
    hasCSSInJS: styling === 'styled-components' || styling === 'emotion',
    hasSass: styling === 'sass',
    hasVanillaExtract: styling === 'vanilla-extract',
    hasUnoCSS: styling === 'uno-css',

    hasRedux: stateManagement === 'redux-toolkit',
    hasZustand: stateManagement === 'zustand',
    hasJotai: stateManagement === 'jotai',
    hasRecoil: stateManagement === 'recoil',
    hasPinia: stateManagement === 'pinia',
    hasNgRx: stateManagement === 'ngrx',
    hasSvelteStores: stateManagement === 'svelte-stores',
    hasMobX: stateManagement === 'mobx',

    hasTanstackQuery: dataFetching === 'tanstack-query',
    hasSWR: dataFetching === 'swr',
    hasApollo: dataFetching === 'apollo',
    hasRtkQuery: dataFetching === 'rtk-query',
    hasTrpc: dataFetching === 'trpc',

    hasReactHookForm: formHandling === 'react-hook-form',
    hasFormik: formHandling === 'formik',
    hasVeeValidate: formHandling === 'vee-validate',
    hasAngularForms: formHandling === 'angular-forms',
    hasZodForms: formHandling === 'zod',

    hasShadcn: answers.componentLibrary === 'shadcn',
    hasMUI: answers.componentLibrary === 'mui',
    hasAntDesign: answers.componentLibrary === 'ant-design',
    hasChakra: answers.componentLibrary === 'chakra',
    hasRadix: answers.componentLibrary === 'radix',
    hasHeadlessUI: answers.componentLibrary === 'headless-ui',
    hasVuetify: answers.componentLibrary === 'vuetify',
    hasPrimeVue: answers.componentLibrary === 'primevue',
    hasAngularMaterial: answers.componentLibrary === 'angular-material',

    hasStorybook: answers.componentDocs === 'storybook',
    hasAuth: answers.auth !== 'none',
    hasPlaywright: answers.e2eFramework === 'playwright',
    hasCypress: answers.e2eFramework === 'cypress',

    buildCommand,
    devCommand,
    lintCommand,
    testCommand,
    e2eCommand,

    componentDir,
    pagesDir,
    storeDir,
  };
}

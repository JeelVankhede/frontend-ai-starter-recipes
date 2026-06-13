/**
 * Choice lists for interactive prompts, filtered by UI framework.
 * @module prompt-choices
 */
import type { UserAnswers } from './types.js';

type Choice<T extends string> = { name: string; value: T };

export type UiFramework = UserAnswers['uiFramework'];

export const uiFrameworkChoices: Choice<UserAnswers['uiFramework']>[] = [
  { name: 'React (recommended)', value: 'react' },
  { name: 'Vue 3', value: 'vue' },
  { name: 'Svelte', value: 'svelte' },
  { name: 'Angular', value: 'angular' },
  { name: 'Solid', value: 'solid' },
  { name: 'Preact', value: 'preact' },
];

export function metaFrameworkChoices(ui: UiFramework): Choice<UserAnswers['metaFramework']>[] {
  switch (ui) {
    case 'react':
      return [
        { name: 'Next.js', value: 'nextjs' },
        { name: 'Remix', value: 'remix' },
        { name: 'None (Vite / CRA-style SPA)', value: 'none' },
      ];
    case 'vue':
      return [
        { name: 'Nuxt', value: 'nuxt' },
        { name: 'None (Vite SPA)', value: 'none' },
      ];
    case 'svelte':
      return [
        { name: 'SvelteKit', value: 'sveltekit' },
        { name: 'None (Vite SPA)', value: 'none' },
      ];
    case 'angular':
      return [{ name: 'None (Angular CLI is the app shell)', value: 'none' }];
    case 'solid':
    case 'preact':
      return [
        { name: 'Astro', value: 'astro' },
        { name: 'None (Vite SPA)', value: 'none' },
      ];
  }
}

export function componentLibraryChoices(ui: UiFramework): Choice<UserAnswers['componentLibrary']>[] {
  if (ui === 'react') {
    return [
      { name: 'shadcn/ui', value: 'shadcn' },
      { name: 'Material UI (MUI)', value: 'mui' },
      { name: 'Ant Design', value: 'ant-design' },
      { name: 'Chakra UI', value: 'chakra' },
      { name: 'Radix UI (primitives)', value: 'radix' },
      { name: 'Headless UI', value: 'headless-ui' },
      { name: 'None', value: 'none' },
    ];
  }
  if (ui === 'vue') {
    return [
      { name: 'Vuetify', value: 'vuetify' },
      { name: 'PrimeVue', value: 'primevue' },
      { name: 'None', value: 'none' },
    ];
  }
  if (ui === 'angular') {
    return [
      { name: 'Angular Material', value: 'angular-material' },
      { name: 'None', value: 'none' },
    ];
  }
  return [{ name: 'None', value: 'none' }];
}

export function stateManagementChoices(ui: UiFramework): Choice<UserAnswers['stateManagement']>[] {
  if (ui === 'react') {
    return [
      { name: 'Redux Toolkit', value: 'redux-toolkit' },
      { name: 'Zustand', value: 'zustand' },
      { name: 'Jotai', value: 'jotai' },
      { name: 'Recoil', value: 'recoil' },
      { name: 'MobX', value: 'mobx' },
      { name: 'None (Context / local state)', value: 'none' },
    ];
  }
  if (ui === 'vue') {
    return [{ name: 'Pinia', value: 'pinia' }, { name: 'None', value: 'none' }];
  }
  if (ui === 'angular') {
    return [{ name: 'NgRx', value: 'ngrx' }, { name: 'None', value: 'none' }];
  }
  if (ui === 'svelte') {
    return [{ name: 'Svelte stores (writable/derived)', value: 'svelte-stores' }, { name: 'None', value: 'none' }];
  }
  return [{ name: 'None', value: 'none' }];
}

export function dataFetchingChoices(ui: UiFramework): Choice<UserAnswers['dataFetching']>[] {
  switch (ui) {
    case 'react':
      return [
        { name: 'TanStack Query', value: 'tanstack-query' },
        { name: 'SWR', value: 'swr' },
        { name: 'Apollo Client', value: 'apollo' },
        { name: 'RTK Query', value: 'rtk-query' },
        { name: 'tRPC client', value: 'trpc' },
        { name: 'None (fetch / axios)', value: 'none' },
      ];
    case 'vue':
      return [
        { name: 'TanStack Query', value: 'tanstack-query' },
        { name: 'Apollo Client', value: 'apollo' },
        { name: 'None', value: 'none' },
      ];
    case 'angular':
      return [{ name: 'None (HttpClient / signals patterns)', value: 'none' }];
    case 'svelte':
    case 'solid':
    case 'preact':
      return [
        { name: 'TanStack Query', value: 'tanstack-query' },
        { name: 'None', value: 'none' },
      ];
  }
}

export function formHandlingChoices(ui: UiFramework): Choice<UserAnswers['formHandling']>[] {
  if (ui === 'react') {
    return [
      { name: 'React Hook Form', value: 'react-hook-form' },
      { name: 'Formik', value: 'formik' },
      { name: 'Zod-only / manual', value: 'zod' },
      { name: 'None', value: 'none' },
    ];
  }
  if (ui === 'vue') {
    return [
      { name: 'VeeValidate', value: 'vee-validate' },
      { name: 'Zod / manual', value: 'zod' },
      { name: 'None', value: 'none' },
    ];
  }
  if (ui === 'angular') {
    return [{ name: 'Angular Reactive Forms', value: 'angular-forms' }, { name: 'None', value: 'none' }];
  }
  return [
    { name: 'Zod / manual', value: 'zod' },
    { name: 'None', value: 'none' },
  ];
}

export const languageChoices: Choice<UserAnswers['language']>[] = [
  { name: 'TypeScript (recommended)', value: 'typescript' },
  { name: 'JavaScript', value: 'javascript' },
];

export const stylingChoices: Choice<UserAnswers['styling']>[] = [
  { name: 'Tailwind CSS', value: 'tailwind' },
  { name: 'CSS Modules', value: 'css-modules' },
  { name: 'Styled Components', value: 'styled-components' },
  { name: 'Emotion', value: 'emotion' },
  { name: 'Sass / SCSS', value: 'sass' },
  { name: 'Vanilla Extract', value: 'vanilla-extract' },
  { name: 'UnoCSS', value: 'uno-css' },
  { name: 'Plain / none', value: 'none' },
];

export const componentDocsChoices: Choice<UserAnswers['componentDocs']>[] = [
  { name: 'Storybook', value: 'storybook' },
  { name: 'None', value: 'none' },
];

export const authChoices: Choice<UserAnswers['auth']>[] = [
  { name: 'OAuth2 provider (Auth0 / Clerk / etc.)', value: 'oauth2-provider' },
  { name: 'JWT (client-side session handling)', value: 'jwt-client' },
  { name: 'Session (cookie-based)', value: 'session' },
  { name: 'Custom', value: 'custom' },
  { name: 'None', value: 'none' },
];

export const testFrameworkChoices: Choice<UserAnswers['testFramework']>[] = [
  { name: 'Vitest', value: 'vitest' },
  { name: 'Jest', value: 'jest' },
];

export const e2eFrameworkChoices: Choice<UserAnswers['e2eFramework']>[] = [
  { name: 'Playwright', value: 'playwright' },
  { name: 'Cypress', value: 'cypress' },
  { name: 'None', value: 'none' },
];

export const cicdChoices: Choice<UserAnswers['cicd']>[] = [
  { name: 'GitHub Actions', value: 'github-actions' },
  { name: 'GitLab CI', value: 'gitlab-ci' },
  { name: 'Vercel', value: 'vercel' },
  { name: 'Netlify', value: 'netlify' },
  { name: 'None', value: 'none' },
];

export const monitoringChoices = [
  { name: 'Sentry', value: 'sentry', checked: true },
  { name: 'LogRocket', value: 'logrocket' },
  { name: 'Datadog RUM', value: 'datadog-rum' },
  { name: 'PostHog', value: 'posthog' },
] as const;


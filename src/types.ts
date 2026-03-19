/**
 * Shared types for CLI answers, presets, and Handlebars context.
 * @module types
 */

/** Answers from interactive prompts or a JSON preset file. */
export interface UserAnswers {
  projectName: string;
  projectDescription: string;
  uiFramework: 'react' | 'vue' | 'svelte' | 'angular' | 'solid' | 'preact';
  metaFramework: 'nextjs' | 'remix' | 'nuxt' | 'sveltekit' | 'astro' | 'none';
  language: 'typescript' | 'javascript';
  styling:
    | 'tailwind'
    | 'css-modules'
    | 'styled-components'
    | 'emotion'
    | 'sass'
    | 'vanilla-extract'
    | 'uno-css'
    | 'none';
  componentLibrary:
    | 'shadcn'
    | 'mui'
    | 'ant-design'
    | 'chakra'
    | 'radix'
    | 'headless-ui'
    | 'vuetify'
    | 'primevue'
    | 'angular-material'
    | 'none';
  stateManagement:
    | 'redux-toolkit'
    | 'zustand'
    | 'jotai'
    | 'recoil'
    | 'pinia'
    | 'ngrx'
    | 'svelte-stores'
    | 'mobx'
    | 'none';
  dataFetching: 'tanstack-query' | 'swr' | 'apollo' | 'rtk-query' | 'trpc' | 'none';
  formHandling: 'react-hook-form' | 'formik' | 'vee-validate' | 'angular-forms' | 'zod' | 'none';
  componentDocs: 'storybook' | 'none';
  auth: 'oauth2-provider' | 'jwt-client' | 'session' | 'custom' | 'none';
  testFramework: 'vitest' | 'jest';
  e2eFramework: 'playwright' | 'cypress' | 'none';
  monitoring: string[];
  cicd: 'github-actions' | 'gitlab-ci' | 'vercel' | 'netlify' | 'none';
  ideTargets: string[];
  skills: string[];
}

/** {@link UserAnswers} plus derived strings and booleans for templates. */
export interface TemplateContext extends UserAnswers {
  isReact: boolean;
  isVue: boolean;
  isSvelte: boolean;
  isAngular: boolean;
  isSolid: boolean;
  isPreact: boolean;

  isNextJS: boolean;
  isRemix: boolean;
  isNuxt: boolean;
  isSvelteKit: boolean;
  isAstro: boolean;
  hasMetaFramework: boolean;

  hasTailwind: boolean;
  hasCSSModules: boolean;
  hasCSSInJS: boolean;
  hasSass: boolean;
  hasVanillaExtract: boolean;
  hasUnoCSS: boolean;

  hasRedux: boolean;
  hasZustand: boolean;
  hasJotai: boolean;
  hasRecoil: boolean;
  hasPinia: boolean;
  hasNgRx: boolean;
  hasSvelteStores: boolean;
  hasMobX: boolean;

  hasTanstackQuery: boolean;
  hasSWR: boolean;
  hasApollo: boolean;
  hasRtkQuery: boolean;
  hasTrpc: boolean;

  hasReactHookForm: boolean;
  hasFormik: boolean;
  hasVeeValidate: boolean;
  hasAngularForms: boolean;
  hasZodForms: boolean;

  hasShadcn: boolean;
  hasMUI: boolean;
  hasAntDesign: boolean;
  hasChakra: boolean;
  hasRadix: boolean;
  hasHeadlessUI: boolean;
  hasVuetify: boolean;
  hasPrimeVue: boolean;
  hasAngularMaterial: boolean;

  hasStorybook: boolean;
  hasAuth: boolean;
  hasPlaywright: boolean;
  hasCypress: boolean;

  buildCommand: string;
  devCommand: string;
  lintCommand: string;
  testCommand: string;
  e2eCommand: string;

  componentDir: string;
  pagesDir: string;
  storeDir: string;
}

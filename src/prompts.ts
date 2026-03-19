/**
 * Interactive Inquirer flow producing {@link UserAnswers} when no `--preset` is used.
 * @module prompts
 */
import { input, select, checkbox } from '@inquirer/prompts';
import type { UserAnswers } from './types.js';
import {
  uiFrameworkChoices,
  metaFrameworkChoices,
  componentLibraryChoices,
  stateManagementChoices,
  dataFetchingChoices,
  formHandlingChoices,
  languageChoices,
  stylingChoices,
  componentDocsChoices,
  authChoices,
  testFrameworkChoices,
  e2eFrameworkChoices,
  cicdChoices,
  monitoringChoices,
  ALL_SKILL_IDS,
} from './prompt-choices.js';

/**
 * Runs the full stack/IDE/skills questionnaire.
 */
export async function askQuestions(): Promise<UserAnswers> {
  const projectName = await input({
    message: 'Project name:',
    default: 'my-frontend',
  });

  const projectDescription = await input({
    message: 'Brief project description:',
    default: 'A frontend web application',
  });

  const uiFramework = await select({
    message: 'UI framework / library:',
    choices: uiFrameworkChoices,
  });

  const metaFramework = await select({
    message: 'Meta-framework (routing / SSR):',
    choices: metaFrameworkChoices(uiFramework),
  });

  const language = await select({
    message: 'Language:',
    choices: languageChoices,
  });

  const styling = await select({
    message: 'Styling approach:',
    choices: stylingChoices,
  });

  const componentLibrary = await select({
    message: 'Component library:',
    choices: componentLibraryChoices(uiFramework),
  });

  const stateManagement = await select({
    message: 'State management:',
    choices: stateManagementChoices(uiFramework),
  });

  const dataFetching = await select({
    message: 'Data fetching / server state:',
    choices: dataFetchingChoices(uiFramework),
  });

  const formHandling = await select({
    message: 'Forms & validation:',
    choices: formHandlingChoices(uiFramework),
  });

  const componentDocs = await select({
    message: 'Component documentation:',
    choices: componentDocsChoices,
  });

  const auth = await select({
    message: 'Client auth model:',
    choices: authChoices,
  });

  const testFramework = await select({
    message: 'Unit / component test runner:',
    choices: testFrameworkChoices,
  });

  const e2eFramework = await select({
    message: 'End-to-end testing:',
    choices: e2eFrameworkChoices,
  });

  const monitoring = await checkbox({
    message: 'Monitoring / analytics (select all that apply):',
    choices: [...monitoringChoices],
  });

  const cicd = await select({
    message: 'CI / CD / hosting pipeline:',
    choices: cicdChoices,
  });

  let ideTargets = await checkbox({
    message: 'Generate instructions for which IDEs? (select all that apply)',
    choices: [
      { name: 'All IDEs (Cursor, Claude Code, Copilot, Antigravity, Windsurf)', value: 'all' },
      { name: 'Cursor (.cursor/rules/)', value: 'cursor' },
      { name: 'Claude Code (CLAUDE.md)', value: 'claude-code' },
      { name: 'VS Code Copilot (.github/copilot-instructions.md)', value: 'vscode-copilot' },
      { name: 'Antigravity (.agents/workflows/)', value: 'antigravity' },
      { name: 'Windsurf (.windsurfrules)', value: 'windsurf' },
    ],
  });

  if (ideTargets.includes('all')) {
    ideTargets = ['cursor', 'claude-code', 'vscode-copilot', 'antigravity', 'windsurf'];
  }

  let skills = await checkbox({
    message: 'Which AI skills/workflows to include?',
    choices: [
      { name: 'All skills', value: 'all' },
      { name: 'plan-review (architecture review before implementation)', value: 'plan-review', checked: true },
      { name: 'code-review (pre-merge diff review + checklist)', value: 'code-review', checked: true },
      { name: 'qa (quality pass: build, tests, a11y, Lighthouse)', value: 'qa', checked: true },
      { name: 'ship (commit / PR workflow)', value: 'ship', checked: true },
      { name: 'document-release (docs after merge)', value: 'document-release' },
      { name: 'retro (productivity retrospective)', value: 'retro' },
      { name: 'performance-audit (CWV, bundle, images)', value: 'performance-audit' },
      { name: 'accessibility-audit (axe, keyboard, WCAG)', value: 'accessibility-audit' },
      { name: 'component-audit (props, complexity, Storybook)', value: 'component-audit' },
      { name: 'dependency-audit (security, licenses, bundle impact)', value: 'dependency-audit' },
    ],
  });

  if (skills.includes('all')) {
    skills = [...ALL_SKILL_IDS];
  }

  return {
    projectName,
    projectDescription,
    uiFramework,
    metaFramework,
    language,
    styling,
    componentLibrary,
    stateManagement,
    dataFetching,
    formHandling,
    componentDocs,
    auth,
    testFramework,
    e2eFramework,
    monitoring,
    cicd,
    ideTargets,
    skills,
  };
}

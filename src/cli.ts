#!/usr/bin/env node
/**
 * CLI entrypoint for frontend-ai-starter-recipes / fare.
 * @module cli
 */

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { expandPath } from './path-utils.js';
import { askQuestions } from './prompts.js';
import { buildContext } from './context-builder.js';
import { TemplateEngine } from './engine.js';
import { FileWriter } from './writer.js';
import fs from 'fs/promises';
import { input, confirm } from '@inquirer/prompts';

import { generateCursor } from './adapters/cursor.js';
import { generateClaudeCode } from './adapters/claude-code.js';
import { generateVsCodeCopilot } from './adapters/vscode-copilot.js';
import { generateAntigravity } from './adapters/antigravity.js';
import { generateWindsurf } from './adapters/windsurf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRootDir = path.resolve(__dirname, '..');

const RULE_FILES = [
  'architecture',
  'components',
  'styling-accessibility',
  'routing',
  'state-and-data-fetching',
  'forms-validation',
  'performance-and-testing',
  'seo-meta',
  'errors-logging',
  'security',
  'environment',
  'git-conventions',
  'pre-commit',
] as const;

const LIFECYCLE_FILES = ['think', 'plan', 'build', 'review', 'test', 'ship', 'reflect'] as const;

const program = new Command();

program
  .name('frontend-ai-starter-recipes')
  .description('Generate customized AI agent instructions for your frontend project')
  .option('-o, --output <dir>', 'Output directory (skip prompt)')
  .option('-p, --preset <name>', 'Use a preset configuration')
  .parse(process.argv);

async function run() {
  const options = program.opts();

  console.log(chalk.bold.cyan('\n🎨 Frontend AI Starter Recipes'));
  console.log(chalk.dim("Let's customize your AI agent instructions.\n"));

  try {
    let outputDir = '';

    if (options.output) {
      outputDir = path.resolve(process.cwd(), expandPath(options.output));
    } else {
      let validDir = false;
      while (!validDir) {
        const answerDir = await input({
          message: 'Where should we generate the files? (Output directory path)',
          default: './',
        });

        outputDir = path.resolve(process.cwd(), expandPath(answerDir));

        try {
          const stat = await fs.stat(outputDir);
          if (stat.isDirectory()) {
            const files = await fs.readdir(outputDir);
            const visibleFiles = files.filter((f) => !f.startsWith('.'));

            if (visibleFiles.length > 0) {
              const proceed = await confirm({
                message: `Directory ${chalk.cyan(outputDir)} is not empty. Proceed anyway? (Files may be overwritten)`,
                default: true,
              });
              if (!proceed) {
                console.log(chalk.yellow("Let's choose a different location."));
                continue;
              }
            }
            validDir = true;
          } else {
            console.log(chalk.red(`Path ${outputDir} exists but is not a directory.`));
          }
        } catch (e: unknown) {
          const err = e as NodeJS.ErrnoException;
          if (err.code === 'ENOENT') {
            const create = await confirm({
              message: `Directory ${chalk.cyan(outputDir)} does not exist. Create it?`,
              default: true,
            });
            if (create) {
              validDir = true;
            } else {
              console.log(chalk.yellow("Let's choose a different location."));
            }
          } else {
            console.error(chalk.red(`Error checking path: ${err.message}`));
            process.exit(1);
          }
        }
      }
    }

    console.log(chalk.dim(`\nOutput path set to: ${outputDir}`));

    let answers;

    if (options.preset) {
      console.log(chalk.cyan(`\n📦 Loading preset: ${options.preset}...`));
      const presetPath = path.join(packageRootDir, 'presets', `${options.preset}.json`);
      try {
        const presetData = await fs.readFile(presetPath, 'utf-8');
        answers = JSON.parse(presetData);
      } catch {
        console.error(
          chalk.red(
            `\n❌ Could not load preset "${options.preset}". Make sure it exists in the presets/ directory.`,
          ),
        );
        process.exit(1);
      }
    } else {
      answers = await askQuestions();
    }

    const context = buildContext(answers);

    console.log(chalk.cyan('\n⚙️  Generating Canonical .ai/ Files...'));

    const engine = new TemplateEngine(packageRootDir);
    await engine.initialize();
    const writer = new FileWriter(outputDir);

    await writer.write('.ai/AGENT.md', await engine.render('agent.hbs', context));

    for (const stage of LIFECYCLE_FILES) {
      await writer.write(`.ai/lifecycle/${stage}.md`, await engine.render(`lifecycle/${stage}.hbs`, context));
    }

    for (const rule of RULE_FILES) {
      await writer.write(`.ai/rules/${rule}.md`, await engine.render(`rules/${rule}.hbs`, context));
    }

    await writer.write('.ai/context/domain-map.md', await engine.render('context/domain-map.hbs', context));
    await writer.write('.ai/context/tech-stack.md', await engine.render('context/tech-stack.hbs', context));
    await writer.write('.ai/tracking/efficiency.md', await engine.render('tracking/efficiency.hbs', context));

    console.log(chalk.cyan('\n⚙️  Running IDE Adapters...'));
    if (context.ideTargets.includes('cursor')) await generateCursor(outputDir, writer);
    if (context.ideTargets.includes('claude-code')) await generateClaudeCode(outputDir, writer);
    if (context.ideTargets.includes('vscode-copilot')) await generateVsCodeCopilot(outputDir, writer);
    if (context.ideTargets.includes('antigravity')) await generateAntigravity(outputDir, writer);
    if (context.ideTargets.includes('windsurf')) await generateWindsurf(outputDir, writer);

    console.log(chalk.bold.green(`\n✨ Success! Output saved to: ${outputDir}`));
  } catch (err) {
    if (err instanceof Error && err.name === 'ExitPromptError') {
      console.log(chalk.yellow('\nPrompt cancelled by user.'));
      process.exit(0);
    }
    console.error(chalk.red('\n❌ Error generating templates:'), err);
    process.exit(1);
  }
}

run();

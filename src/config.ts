import fs from 'fs';
import os from 'os';
import path from 'path';
import chalk from 'chalk';
import { confirm } from '@inquirer/prompts';

const CONFIG_PATH = path.join(os.homedir(), '.config', 'fare', 'config.json');

export function loadConfig(): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function saveConfig(data: Record<string, unknown>): void {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

export async function resolveTrackingConsent(): Promise<boolean> {
  const config = loadConfig();
  if (typeof config.telemetry === 'boolean') return config.telemetry;
  if (!process.stdin.isTTY) return false;

  console.log(`
${chalk.bold.cyan('📊  Anonymous usage tracking')}

  ${chalk.dim('fare collects anonymous data to understand how the tool is used')}
  ${chalk.dim('and where to focus improvements. No personal data is ever collected.')}

  ${chalk.bold('What is tracked:')}
    ${chalk.green('·')} Preset name              e.g. react-vite-tailwind
    ${chalk.green('·')} IDE adapters selected     e.g. cursor, claude-code
    ${chalk.green('·')} Write mode chosen         backup / skip / overwrite
    ${chalk.green('·')} Success or failure
    ${chalk.green('·')} Node.js version, OS platform, fare version

  ${chalk.bold('What is never collected:')}
    ${chalk.red('·')} Your output path or project name
    ${chalk.red('·')} File contents of any kind
    ${chalk.red('·')} Environment variable values
    ${chalk.red('·')} IP address  (anonymised server-side by Mixpanel)

  ${chalk.dim('You can change this preference any time by editing or deleting')}
  ${chalk.dim('~/.config/fare/config.json')}
`);

  const allowed = await confirm({
    message: 'Allow anonymous usage tracking to help improve fare?',
    default: true,
  });

  saveConfig({ ...config, telemetry: allowed });

  console.log(
    allowed
      ? chalk.dim('\n  Thanks. You can opt out any time by editing ~/.config/fare/config.json\n')
      : chalk.dim('\n  No data will be collected. You can change this any time via ~/.config/fare/config.json\n'),
  );

  return allowed;
}

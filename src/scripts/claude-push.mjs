#!/usr/bin/env node
// scripts/claude-push.mjs
// Called by Claude after editing data files.
// Usage: node scripts/claude-push.mjs --message="..." --product=... --source=granola

import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function run(cmd, silent = false) {
  return execSync(cmd, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: silent ? 'pipe' : 'inherit',
  });
}

function arg(name) {
  const found = process.argv.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=').slice(1).join('=') : null;
}

const message = arg('message') ?? `data: sync [${new Date().toISOString().split('T')[0]}]`;
const product = arg('product') ?? 'multiple';
const source  = arg('source')  ?? 'claude';

// Configure git identity if not set
try { run('git config user.email', true); }
catch { run('git config user.email "claude-sync@x-rr-insights"'); run('git config user.name "Claude Insight Sync"'); }

// Stage only safe paths
const SAFE = ['data/', 'views/', 'types/', 'components/', 'App.tsx', 'index.css', 'index.html'];
for (const p of SAFE) { try { run(`git add ${p}`, true); } catch { /* path may not exist */ } }

const staged = run('git diff --cached --name-only', true).trim();
if (!staged) { console.log('Nothing to commit.'); process.exit(0); }

const today = new Date().toISOString().split('T')[0];
const fullMsg = [message, '', `product: ${product}`, `source: ${source}`, `date: ${today}`, `files: ${staged.split('\n').join(', ')}`].join('\n');

run(`git commit -m ${JSON.stringify(fullMsg)}`);
run('git push origin main');

console.log('\n✅ Pushed to origin/main');
console.log('🚀 GitHub Actions deploying now (~60 seconds)');
console.log('🌐 https://YOUR_USERNAME.github.io/x-rr-insights/\n');

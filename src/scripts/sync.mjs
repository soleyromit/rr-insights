#!/usr/bin/env node
// ─────────────────────────────────────────────
// scripts/sync.mjs
//
// PURPOSE
// -------
// Automated sync script. Claude edits data/*.ts files
// with new insights from Granola / docs / transcripts.
// This script commits and pushes those changes automatically.
//
// USAGE
// -----
// Called by Claude after updating data files:
//   node scripts/sync.mjs --message="Add FaaS insights from Touro meeting Mar 18"
//
// Or via npm:
//   npm run sync -- --message="..."
//
// Or via the GitHub Action (auto-triggered on push)
//
// WHAT IT DOES
// ------------
// 1. Checks which data/*.ts files changed (git diff)
// 2. Stages only data/ and views/products/ changes
// 3. Commits with auto-generated or provided message
// 4. Pushes to origin/main
// 5. GitHub Action picks up the push and redeploys
// ─────────────────────────────────────────────

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: opts.silent ? 'pipe' : 'inherit', ...opts });
  } catch (e) {
    if (opts.allowFail) return '';
    throw e;
  }
}

function getChangedFiles() {
  const output = run('git diff --name-only HEAD', { silent: true });
  const staged  = run('git diff --cached --name-only', { silent: true });
  return [...new Set([...output.split('\n'), ...staged.split('\n')].filter(Boolean))];
}

function buildCommitMessage(changedFiles) {
  const products = [];
  const sections = [];

  for (const f of changedFiles) {
    if (f.includes('data/insights'))   sections.push('insights');
    if (f.includes('data/products'))   sections.push('products');
    if (f.includes('data/personas'))   sections.push('personas');
    if (f.includes('ExamManagement'))  products.push('Exam Management');
    if (f.includes('FaaS') || f.includes('faas'))  products.push('FaaS');
    if (f.includes('course-eval'))     products.push('Course Eval');
    if (f.includes('skills'))          products.push('Skills Checklist');
    if (f.includes('learning'))        products.push('Learning Contracts');
  }

  const uniqueProducts = [...new Set(products)];
  const uniqueSections = [...new Set(sections)];
  const today = new Date().toISOString().split('T')[0];

  if (uniqueProducts.length > 0) {
    return `data: update ${uniqueProducts.join(', ')} — ${uniqueSections.join(', ')} [${today}]`;
  }
  return `data: sync insight hub data files [${today}]`;
}

async function main() {
  const args = process.argv.slice(2);
  const messageArg = args.find(a => a.startsWith('--message='));
  const dryRun     = args.includes('--dry-run');
  const source     = args.find(a => a.startsWith('--source='))?.split('=')[1] ?? 'manual';

  console.log('\n🔄 Insight Hub sync starting...\n');

  // Check git status
  const status = run('git status --short', { silent: true });
  if (!status.trim()) {
    console.log('✅ Nothing to commit — working tree clean.');
    return;
  }

  console.log('Changed files:\n' + status);

  // Stage data files and product views only (never stage secrets or env files)
  const SAFE_PATHS = [
    'data/',
    'views/',
    'types/',
    'components/',
    'App.tsx',
    'index.css',
    'index.html',
    'index.tsx',
  ];

  for (const path of SAFE_PATHS) {
    run(`git add ${path}`, { allowFail: true, silent: true });
  }

  const staged = run('git diff --cached --name-only', { silent: true }).trim();
  if (!staged) {
    console.log('⚠️  No safe files to stage. Check paths.');
    return;
  }

  console.log('\nStaged:\n' + staged);

  const changedFiles = staged.split('\n').filter(Boolean);
  const commitMsg = messageArg
    ? messageArg.replace('--message=', '')
    : buildCommitMessage(changedFiles);

  const fullMessage = `${commitMsg}\n\nsource: ${source}\nfiles: ${changedFiles.join(', ')}`;

  console.log(`\n📝 Commit message:\n  ${commitMsg}`);

  if (dryRun) {
    console.log('\n🔵 Dry run — not committing or pushing.');
    return;
  }

  run(`git commit -m "${fullMessage.replace(/"/g, '\\"')}"`);
  run('git push origin main');

  console.log('\n✅ Pushed to origin/main');
  console.log('🚀 GitHub Action will deploy in ~60 seconds.');
  console.log('🌐 https://YOUR_USERNAME.github.io/exxat-rr-insights/\n');
}

main().catch(e => {
  console.error('❌ Sync failed:', e.message);
  process.exit(1);
});

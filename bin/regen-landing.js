#!/usr/bin/env node
// Generate or refresh the landing index.html inside an artifact folder.
//
// Usage: node bin/regen-landing.js <project>/<artifact>
//
// If the artifact folder has a source-provided index.html (one not created by
// this script), leave it alone. Otherwise, generate a landing page that lists
// every .html file in the folder as a clickable variant.
//
// The marker `<!-- generated-by: regen-landing -->` identifies auto-generated
// landings so re-running this after a source-provided index.html is added
// won't overwrite the real one.

const fs = require('fs');
const path = require('path');

const MARKER = '<!-- generated-by: regen-landing -->';

function fail(msg) {
  console.error(`regen-landing: ${msg}`);
  process.exit(1);
}

const arg = process.argv[2];
if (!arg) fail('missing argument: expected <project>/<artifact>');

const ROOT = path.resolve(__dirname, '..');
const artifactDir = path.join(ROOT, arg);
if (!fs.existsSync(artifactDir) || !fs.statSync(artifactDir).isDirectory()) {
  fail(`not a directory: ${artifactDir}`);
}

const indexPath = path.join(artifactDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const existing = fs.readFileSync(indexPath, 'utf8');
  if (!existing.includes(MARKER)) {
    console.log(`skip: source-provided index.html present at ${arg}/index.html`);
    process.exit(0);
  }
}

const htmlFiles = fs.readdirSync(artifactDir)
  .filter(f => f.endsWith('.html') && f !== 'index.html')
  .sort();

if (htmlFiles.length === 0) {
  fail(`no .html files in ${artifactDir}`);
}

// Derive a friendly label from a filename.
// Strip common prefix across all files (if any), strip .html, hyphens → spaces, title-case.
function commonPrefix(arr) {
  if (arr.length === 0) return '';
  let p = arr[0];
  for (const s of arr) {
    while (!s.startsWith(p)) p = p.slice(0, -1);
    if (!p) return '';
  }
  return p;
}

const names = htmlFiles.map(f => f.replace(/\.html$/, ''));
let prefix = commonPrefix(names);
if (!prefix.endsWith('-')) prefix = prefix.replace(/-[^-]*$/, '-');
if (prefix.length < 3) prefix = '';

function titleCase(s) {
  if (!s) return 'Default';
  return s.split('-')
    .map(w => w.length ? w[0].toUpperCase() + w.slice(1) : w)
    .join(' ');
}

const artifactName = path.basename(artifactDir);
const projectName = path.basename(path.dirname(artifactDir));

const variants = htmlFiles.map(file => {
  const base = file.replace(/\.html$/, '');
  const suffix = prefix && base.startsWith(prefix) ? base.slice(prefix.length) : base;
  const label = titleCase(suffix);
  return { file, label };
});

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const items = variants.map(v =>
  `    <a class="variant" href="./${v.file}"><span class="label">${escapeHtml(v.label)}</span><span class="file">${escapeHtml(v.file)}</span></a>`
).join('\n');

const html = `<!DOCTYPE html>
${MARKER}
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(artifactName)} — ${escapeHtml(projectName)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root {
    --bg: #FAF6F4;
    --card: #FFFFFF;
    --text: #2C2421;
    --body: #444444;
    --muted: #797979;
    --border: #E8E0DC;
    --accent: #C2604A;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 48px 24px 80px;
    background: var(--bg);
    color: var(--body);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 17px;
    line-height: 1.7;
  }
  .container { max-width: 720px; margin: 0 auto; }
  .crumb { font-size: 13px; color: var(--muted); margin-bottom: 8px; }
  .crumb a { color: var(--muted); text-decoration: none; }
  .crumb a:hover { color: var(--accent); text-decoration: underline; }
  h1 { font-size: 32px; line-height: 1.2; font-weight: 700; color: var(--text); margin: 0 0 8px; }
  .sub { font-size: 15px; color: var(--muted); margin: 0 0 40px; }
  .variants { background: var(--card); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
  .variant { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 16px 24px; border-top: 1px solid var(--border); color: var(--accent); text-decoration: none; font-weight: 700; }
  .variant:first-of-type { border-top: none; }
  .variant:hover { background: var(--bg); }
  .variant .label { font-size: 17px; }
  .variant .file { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; color: var(--muted); font-weight: 400; }
  footer { margin-top: 40px; font-size: 13px; color: var(--muted); text-align: center; }
</style>
</head>
<body>
<div class="container">
  <div class="crumb"><a href="../../">BaseIQ Previews</a> / ${escapeHtml(projectName)}</div>
  <h1>${escapeHtml(artifactName)}</h1>
  <p class="sub">${variants.length} variant${variants.length === 1 ? '' : 's'} available. Click to open.</p>

  <div class="variants">
${items}
  </div>

  <footer>Auto-generated by <code>/share-preview</code></footer>
</div>
</body>
</html>
`;

fs.writeFileSync(indexPath, html);
console.log(`wrote: ${arg}/index.html (${variants.length} variant${variants.length === 1 ? '' : 's'})`);

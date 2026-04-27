#!/usr/bin/env node
// Regenerate the top-level index.html gallery.
//
// Usage: node bin/regen-gallery.js
//
// Recursively walks previews/ to find every "artifact" — defined as a folder
// that has an index.html which is NOT a redirect stub. Folders without
// index.html (supporting assets like a shared styles/) and folders whose
// index.html carries the redirect-marker (alias URLs preserved for the team)
// are excluded.
//
// Each artifact is grouped in the gallery by its parent path relative to
// previews/ — e.g. an artifact at `previews/baselocal/newsletters/7xv1/`
// is grouped under "baselocal/newsletters". Last-updated dates come from
// git log on each artifact folder.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const IGNORE = new Set(['bin', '.git', '.github']);
const REDIRECT_MARKER = '<!-- redirect-to:';

function listDirs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !IGNORE.has(d.name))
    .map(d => d.name)
    .sort();
}

function hasIndex(artifactDir) {
  return fs.existsSync(path.join(artifactDir, 'index.html'));
}

function isRedirect(artifactDir) {
  const indexPath = path.join(artifactDir, 'index.html');
  if (!fs.existsSync(indexPath)) return false;
  const fd = fs.openSync(indexPath, 'r');
  const buf = Buffer.alloc(256);
  fs.readSync(fd, buf, 0, 256, 0);
  fs.closeSync(fd);
  return buf.toString('utf8').includes(REDIRECT_MARKER);
}

function isGalleryArtifact(artifactDir) {
  return hasIndex(artifactDir) && !isRedirect(artifactDir);
}

function lastUpdated(relPath) {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${relPath}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
    return out || 'unknown';
  } catch {
    return 'unknown';
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Recursively find every artifact folder. Returns array of
// { name, group, relPath } where:
//   name    — the folder name
//   group   — parent path relative to ROOT (e.g. "baselocal/newsletters")
//   relPath — full path relative to ROOT (group + "/" + name)
function findArtifacts(dir, prefix = '') {
  const results = [];
  for (const name of listDirs(dir)) {
    const full = path.join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (isGalleryArtifact(full)) {
      results.push({ name, group: prefix || '(root)', relPath: rel });
    } else if (!hasIndex(full)) {
      // Asset folder (e.g. styles) or a navigation folder (e.g. baselocal). Recurse.
      results.push(...findArtifacts(full, rel));
    }
    // else: redirect stub — skip
  }
  return results;
}

const artifacts = findArtifacts(ROOT);

// Group by group path, preserving sort order
const groups = new Map();
for (const a of artifacts) {
  if (!groups.has(a.group)) groups.set(a.group, []);
  groups.get(a.group).push(a);
}

const sortedGroups = Array.from(groups.keys()).sort();
const sections = sortedGroups.map(group => {
  const items = groups.get(group).map(a =>
    `    <a class="artifact" href="${a.relPath}/"><span class="slug">${escapeHtml(a.name)}</span><span class="date">updated ${lastUpdated(a.relPath)}</span></a>`
  ).join('\n');
  return `  <div class="project">
    <h2>${escapeHtml(group)}</h2>
${items}
  </div>`;
});

const body = sections.length === 0
  ? `  <div class="empty">No artifacts published yet.</div>`
  : sections.join('\n\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BaseIQ Previews</title>
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
  h1 { font-size: 32px; line-height: 1.2; font-weight: 700; color: var(--text); margin: 0 0 8px; }
  .sub { font-size: 15px; color: var(--muted); margin: 0 0 40px; }
  .project { margin-bottom: 32px; padding: 24px; background: var(--card); border: 1px solid var(--border); border-radius: 6px; }
  .project h2 { font-size: 16px; font-weight: 700; color: var(--text); margin: 0 0 16px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: -0.2px; }
  .artifact { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 12px 0; border-top: 1px solid var(--border); color: var(--accent); text-decoration: none; font-weight: 700; }
  .artifact:first-of-type { border-top: none; padding-top: 4px; }
  .artifact:hover { text-decoration: underline; }
  .artifact .slug { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 15px; }
  .artifact .date { font-weight: 400; font-size: 13px; color: var(--muted); white-space: nowrap; }
  .empty { font-style: italic; color: var(--muted); padding: 24px; text-align: center; }
  footer { margin-top: 40px; font-size: 13px; color: var(--muted); text-align: center; }
  footer code { background: var(--card); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
  <h1>BaseIQ Previews</h1>
  <p class="sub">Rendered HTML artifacts across all BaseIQ brands. Click any artifact to open.</p>

${body}

  <footer>Auto-generated. Source: <a href="https://github.com/base-iq/previews">base-iq/previews</a></footer>
</div>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'index.html'), html);
console.log(`wrote: index.html (${groups.size} group${groups.size === 1 ? '' : 's'}, ${artifacts.length} artifact${artifacts.length === 1 ? '' : 's'})`);

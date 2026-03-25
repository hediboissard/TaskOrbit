/** Lightweight "build": syntax-check all backend JS entrypoints. */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function check(file) {
  execSync(`node --check "${file}"`, { stdio: 'inherit', cwd: root });
}

const top = path.join(root, 'server.js');
if (!fs.existsSync(top)) {
  console.error('server.js not found');
  process.exit(1);
}
check(top);

const dirs = ['routes', 'controllers', 'middleware', 'models', 'config', 'utils'];
for (const d of dirs) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.js')) check(path.join(dir, f));
  }
}

console.log('Build OK: syntax check passed.');

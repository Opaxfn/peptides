#!/usr/bin/env node
/**
 * Copies the admin build from .medusa/server/public/admin to public/admin
 * so that "medusa start" finds index.html (it expects public/admin at project root).
 */
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const src = path.join(projectRoot, '.medusa/server/public/admin');
const dest = path.join(projectRoot, 'public/admin');

if (!fs.existsSync(src)) {
  console.warn('scripts/copy-admin-build.js: No admin build at', src);
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(src, dest, { recursive: true });
console.log('Admin build copied to public/admin');

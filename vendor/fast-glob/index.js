"use strict";

// Minimal stand-in for fast-glob, substituted into @next/eslint-plugin-next via
// the "overrides" field in the root package.json. fast-glob pulls in braces,
// which has an unpatched high-severity advisory (GHSA-vfj7-8cjw-p6xm). The plugin
// only calls globSync(pattern, { onlyDirectories: true }) to resolve the
// settings.next.rootDir ESLint setting, so this maps that call onto tinyglobby
// with fast-glob's output shape. Delete this package and the override once the
// plugin no longer depends on fast-glob.

const path = require("node:path");
const tinyglobby = require("tinyglobby");

function globSync(pattern, options = {}) {
  return tinyglobby
    .globSync(pattern, {
      ...options,
      absolute: path.isAbsolute(String(pattern)),
      expandDirectories: false,
    })
    .map((entry) => entry.replace(/\/$/, ""));
}

module.exports = { globSync, sync: globSync };

/**
 * Lists everything in content/site.ts that is still empty.
 *
 *   npm run placeholders
 *
 * Exits with 0 either way: it is a checklist, not a gate.
 */
import * as content from "../content/site.ts";

const OPTIONAL = [
  /^site\.profiles$/,
  /^site\.booking\.embed$/,
  /^testimonials$/,
  /^projects\[\d+\]\.results$/,
  /^privacy\.hosting$/,
];

const todo = [];
const optional = [];

function walk(value, path) {
  if (value === null) {
    todo.push(path);
  } else if (Array.isArray(value)) {
    if (value.length === 0) (OPTIONAL.some((re) => re.test(path)) ? optional : todo).push(path);
    value.forEach((item, i) => walk(item, `${path}[${i}]`));
  } else if (typeof value === "object") {
    for (const [key, child] of Object.entries(value)) walk(child, path ? `${path}.${key}` : key);
  }
}

for (const name of ["site", "home", "projects", "studio", "team", "testimonials", "privacy"]) {
  walk(content[name], name);
}

const group = (paths) => {
  const groups = new Map();
  for (const p of paths) {
    const root = p.split(/[.[]/)[0];
    groups.set(root, [...(groups.get(root) ?? []), p]);
  }
  return groups;
};

console.log("To fill in (content/site.ts)\n");
// One line per object: projects[0]: name, client, type, ...
const collapse = (paths) => {
  const byParent = new Map();
  for (const p of paths) {
    const cut = p.lastIndexOf(".");
    const parent = cut === -1 ? p : p.slice(0, cut);
    byParent.set(parent, [...(byParent.get(parent) ?? []), cut === -1 ? "" : p.slice(cut + 1)]);
  }
  return [...byParent].map(([parent, fields]) => (fields[0] === "" ? parent : `${parent}: ${fields.join(", ")}`));
};

for (const [root, paths] of group(todo)) {
  console.log(`  ${root}  (${paths.length})`);
  for (const line of collapse(paths)) console.log(`    - ${line}`);
}
console.log("\nOptional: leave empty if you have nothing real to put here");
for (const p of optional) console.log(`    - ${p}`);

console.log("\nAlso confirm (values exist but were written for you, not by you)");
console.log("    - estimator: all prices and week counts are indicative placeholders");
console.log("    - services, process, faqs, securityPractices, studio.workingAgreements: draft copy carried over from the old site");
console.log("    - home.headline, home.lede, home.statement, home.closing: draft positioning copy");
console.log("    - site.url: carried over from the old metadata");
console.log("    - skills: carried over from the old site's tech list");

console.log(`\n${todo.length} empty field(s) to fill, ${optional.length} optional.`);

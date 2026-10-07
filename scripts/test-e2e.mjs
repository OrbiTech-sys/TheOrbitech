/**
 * Builds the site into its own folder (.next-test) and runs the browser tests.
 * A dev server running from .next is left untouched.
 *
 *   npm run test:e2e [-- extra playwright args]
 */
import { spawnSync } from "node:child_process";

const env = { ...process.env, NEXT_DIST_DIR: ".next-test" };
const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: "inherit", env, shell: true });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run("npx", ["next", "build"]);
run("npx", ["playwright", "test", ...process.argv.slice(2)]);

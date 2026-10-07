import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Unused components kept for reference (see components/_legacy/README.md).
    "components/_legacy/**",
    // CommonJS dependency shims (see vendor/fast-glob/index.js).
    "vendor/**",
    // Test output
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      // The real package throws outside a server build. Tests run on the server side, so stub it.
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    // Signing secret for the verification cookies. Real runs read OTP_SECRET from .env.local.
    env: { OTP_SECRET: "test-only-secret-0123456789abcdef0123456789" },
  },
});

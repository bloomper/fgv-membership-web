import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  // The Playwright specs in e2e/ are run by `npm run test:e2e`
  test: { exclude: ["e2e/**", "node_modules/**", ".next/**"] },
});

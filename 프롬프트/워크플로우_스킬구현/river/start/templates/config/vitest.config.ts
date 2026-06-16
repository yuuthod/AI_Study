import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["app/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      // 래칫: 커버리지 기준은 내려가지 않는다. 필요 시 workflow-change로 상향.
      thresholds: { lines: 60, functions: 60, branches: 50, statements: 60 },
    },
  },
});

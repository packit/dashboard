// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT
/// <reference types="vitest" />
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: function manualChunks(id) {
          if (id.includes("victory-") || id.includes("d3") || id.includes("@patternfly/react-charts")) {
            return "charts";
          } else if (id.includes("@patternfly")) {
            return "patternfly";
          } else if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
      external: ["sharp"],
    },
    esbuild: {
      loader: "tsx",
      include: /src\/.*\.[tj]sx?$/,
      exclude: [],
    },
  },
  plugins: [
    TanStackRouterVite(),
    preact(),
    ViteImageOptimizer(),
    // Put the Sentry vite plugin after all other plugins
    sentryVitePlugin({
      org: "red-hat-it",
      project: "pckt-002-packit-service",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      reactComponentAnnotation: { enabled: true },
      disable: process.env.SENTRY_AUTH_TOKEN === undefined,
    }),
  ],
  server: {
    open: true,
  },
  test: {
    environment: "happy-dom",
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
  },
  coverage: {
    provider: "v8",
  }
}));

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: function manualChunks(id) {
          if (
            id.includes("victory-") ||
            id.includes("d3") ||
            id.includes("@patternfly/react-charts")
          ) {
            return "charts";
          } else if (id.includes("@patternfly")) {
            return "patternfly";
          } else if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    esbuild: {
      loader: "tsx",
      include: /src\/.*\.[tj]sx?$/,
      exclude: [],
    },
  },
  plugins: [
    react(),
    ViteImageOptimizer(),
    // Put the Sentry vite plugin after all other plugins
    sentryVitePlugin({
      org: "red-hat-it",
      project: "pckt-002-packit-service",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      reactComponentAnnotation: { enabled: true },
    }),
  ],
  server: {
    open: true,
  },
}));

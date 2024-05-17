// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    // Put the Sentry vite plugin after all other plugins
    sentryVitePlugin({
      org: "red-hat-it",
      project: "pckt-002-packit-service",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
      reactComponentAnnotation: { enabled: true },
    }),
  ],
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  server: {
    open: true,
  },
}));

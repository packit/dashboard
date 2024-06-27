// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly-addons.css";
import * as Sentry from "@sentry/react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "./app/NotFound/NotFound";
import { createRoot } from "react-dom/client";

const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound });

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

// Setup Sentry logging so we can detect regressions, crashes, etc. ASAP
Sentry.init({
  // packit-service
  dsn: import.meta.env.VITE_SENTRY_DSN || undefined,

  integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],

  environment: import.meta.env.PROD
    ? import.meta.env.VITE_API_URL === "https://stg.packit.dev/api"
      ? "stg"
      : "prod"
    : "dev",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/dashboard\.stg\.packit\.com/,
  ],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
);

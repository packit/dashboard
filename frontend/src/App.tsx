// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly-addons.css";
import * as Sentry from "@sentry/react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { routes } from "./app/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

Sentry.init({
  // packit-service
  dsn: import.meta.env.VITE_SENTRY_DSN || undefined,
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],

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
const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouter(createBrowserRouter);

const queryClient = new QueryClient();
const router = sentryCreateBrowserRouter(routes);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
export { App };

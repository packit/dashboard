// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs/testing-farm-runs")({
  loader: ({ location }) => {
    throw redirect({
      to: location.pathname.replace("/testing-farm-runs", "/testing-farm"),
    });
  },
});

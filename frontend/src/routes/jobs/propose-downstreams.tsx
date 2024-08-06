// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs/propose-downstreams")({
  loader: ({ location }) => {
    throw redirect({
      to: location.pathname.replace(
        "/propose-downstreams",
        "/sync-release/downstream",
      ),
    });
  },
});

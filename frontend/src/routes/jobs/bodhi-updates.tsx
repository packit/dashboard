// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs/bodhi-updates")({
  loader: ({ location }) => {
    throw redirect({
      to: location.pathname.replace("/bodhi-updates", "/bodhi"),
    });
  },
});

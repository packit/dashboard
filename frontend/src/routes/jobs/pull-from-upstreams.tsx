// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs/pull-from-upstreams")({
  loader: ({ location }) => {
    throw redirect({
      to: location.pathname.replace(
        "/pull-from-upstreams",
        "/pull-from-upstream",
      ),
    });
  },
});

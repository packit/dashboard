// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs/koji-builds")({
  loader: ({ location }) => {
    throw redirect({
      to: location.pathname.replace("/koji-builds", "/koji"),
    });
  },
});

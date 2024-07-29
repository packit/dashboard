// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/jobs/")({
  loader: () => {
    throw redirect({
      to: "/jobs/copr",
      replace: true,
    });
  },
});

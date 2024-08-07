// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pipelines")({
  loader: ({ location }) => {
    throw redirect({
      to: location.pathname.replace("/pipelines", "/pipeline"),
    });
  },
});

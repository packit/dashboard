// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$forge/$namespace/$repo")({
  staticData: {
    title: "Project detail",
  },
});

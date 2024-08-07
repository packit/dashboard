// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/")({
  staticData: {
    title: "Projects",
  },
});

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { projectQueryOptions } from "../../queries/projectsQuery";
import { Projects } from "../../components/projects/Projects";

export const Route = createFileRoute("/projects")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(projectQueryOptions());
  },
  component: Project,
});

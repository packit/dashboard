// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createLazyFileRoute } from "@tanstack/react-router";
// import { projectQueryOptions } from "../../queries/projectsQuery";
import { Projects } from "../../components/projects/Projects";

export const Route = createLazyFileRoute("/projects/$forge/$namespace/$repo")({
  // loader: async ({ context }) => {
  //   await context.queryClient.ensureQueryData(projectQueryOptions());
  // },
  component: () => <>test</>,
});

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createLazyFileRoute } from "@tanstack/react-router";
import { Project } from "../../components/projects/Project";

export const Route = createLazyFileRoute("/projects/$forge/$namespace/$repo")({
  component: Project,
});

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createLazyFileRoute } from "@tanstack/react-router";
import { Projects } from "../../components/projects/Projects";

export const Route = createLazyFileRoute("/projects/")({
  component: Projects,
});

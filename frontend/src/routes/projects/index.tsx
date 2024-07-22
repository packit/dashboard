// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "../../components/projects/Projects";

export const Route = createFileRoute("/projects/")({
  component: Projects,
});

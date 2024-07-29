// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createLazyFileRoute } from "@tanstack/react-router";
import { Namespace } from "../../components/projects/Namespace";

export const Route = createLazyFileRoute("/projects/$forge/$namespace")({
  component: Namespace,
});

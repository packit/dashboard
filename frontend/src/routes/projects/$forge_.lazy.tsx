// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createLazyFileRoute } from "@tanstack/react-router";
import { Forge } from "../../components/projects/Forge";

export const Route = createLazyFileRoute("/projects/$forge")({
  component: Forge,
});

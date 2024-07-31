// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { CoprBuild } from "../../../components/copr/CoprBuild";

export const Route = createFileRoute("/jobs/copr/$id")({
  component: CoprBuild,
});

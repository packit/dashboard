// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { CoprBuildsTable } from "../../components/copr/CoprBuildsTable";

export const Route = createFileRoute("/jobs/copr")({
  staticData: {
    title: "Copr builds",
  },
  component: CoprBuildsTable,
});

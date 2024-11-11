// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute, redirect } from "@tanstack/react-router";
import { OSHScansTable } from "../../components/osh/OSHScansTable";

export const Route = createFileRoute("/jobs/osh-scans")({
  staticData: {
    title: "OSH scan jobs",
  },
  component: () => OSHScansTable(),
});

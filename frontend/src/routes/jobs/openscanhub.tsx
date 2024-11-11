// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { OSHScansTable } from "../../components/osh/OSHScansTable";

export const Route = createFileRoute("/jobs/openscanhub")({
  staticData: {
    title: "OpenScanHub jobs",
  },
  component: () => OSHScansTable(),
});

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { BodhiUpdatesTable } from "../../components/bodhi/BodhiUpdatesTable";

export const Route = createFileRoute("/jobs/bodhi")({
  component: () => BodhiUpdatesTable(),
});

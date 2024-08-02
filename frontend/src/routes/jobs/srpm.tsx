// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { SRPMBuildsTable } from "../../components/srpm/SRPMBuildsTable";

export const Route = createFileRoute("/jobs/srpm")({
  component: () => SRPMBuildsTable(),
});

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { TestingFarmRunsTable } from "../../components/testing-farm/TestingFarmRunsTable";

export const Route = createFileRoute("/jobs/testing-farm")({
  component: () => TestingFarmRunsTable(),
});

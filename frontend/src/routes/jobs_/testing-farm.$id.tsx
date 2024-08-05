// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { testingFarmRunQueryOptions } from "../../queries/testingFarm/testingFarmRunQuery";
import { TestingFarmRun } from "../../components/testing-farm/TestingFarmRun";

export const Route = createFileRoute("/jobs/testing-farm/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(testingFarmRunQueryOptions({ id })),
  component: TestingFarmRun,
});

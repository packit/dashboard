// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { OSHScan } from "../../components/osh/OSHScan";
import { oshScanQueryOptions } from "../../queries/osh/oshScanQuery";

export const Route = createFileRoute("/jobs/osh-scans/$id")({
  staticData: {
    title: "OSH scan job detail",
  },
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(oshScanQueryOptions({ id })),
  component: OSHScan,
});

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { OSHScan } from "../../components/osh/OSHScan";
import { oshScanQueryOptions } from "../../queries/osh/oshScanQuery";

export const Route = createFileRoute("/jobs/openscanhub/$id")({
  staticData: {
    title: "OpenScanHub job detail",
  },
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(oshScanQueryOptions({ id })),
  component: OSHScan,
});

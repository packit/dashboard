// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { BodhiUpdate } from "../../components/bodhi/BodhiUpdate";
import { bodhiUpdateQueryOptions } from "../../queries/bodhi/bodhiUpdateQuery";

export const Route = createFileRoute("/jobs/bodhi/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(bodhiUpdateQueryOptions({ id })),
  component: BodhiUpdate,
});

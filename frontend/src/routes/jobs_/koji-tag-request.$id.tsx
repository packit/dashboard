// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import { KojiTagRequest } from "../../components/koji/KojiTagRequest";
import { kojiTagRequestQueryOptions } from "../../queries/koji/kojiTagRequestQuery";

export const Route = createFileRoute("/jobs/koji-tag-request/$id")({
  staticData: {
    title: "Koji tag request detail",
  },
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(kojiTagRequestQueryOptions({ id })),
  component: KojiTagRequest,
});

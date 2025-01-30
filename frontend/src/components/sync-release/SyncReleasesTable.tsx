// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useState } from "react";

import {
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { SkeletonTable } from "@patternfly/react-component-groups";
import { useQuery } from "@tanstack/react-query";
import { syncReleasesQueryOptions } from "../../queries/sync-release/syncReleasesQuery";
import { ErrorConnection } from "../errors/ErrorConnection";
import { ForgeIcon } from "../icons/ForgeIcon";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";
import { Timestamp } from "../shared/Timestamp";
import { SyncReleaseTargetStatusLabel } from "../statusLabels/SyncReleaseTargetStatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";
interface SyncReleasesTableProps {
  job: "pull-from-upstream" | "propose-downstream";
}
export const SyncReleasesTable: React.FC<SyncReleasesTableProps> = ({
  job,
}) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const value = { page, setPage, perPage, setPerPage };

  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    targets: "Targets",
    timeSubmitted: "Time Submitted",
  };

  const { isLoading, isError, data } = useQuery(
    syncReleasesQueryOptions({ job, pageParam: page, perPage }),
  );

  const TableHeads = [
    <Th key={columnNames.forge}>
      <span className="pf-v6-u-screen-reader">{columnNames.forge}</span>
    </Th>,
    <Th key={columnNames.trigger} width={25}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.targets} width={60}>
      {columnNames.targets}
    </Th>,
    <Th key={columnNames.timeSubmitted} width={20}>
      {columnNames.timeSubmitted}
    </Th>,
  ];

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  return (
    <PackitPaginationContext.Provider value={value}>
      <PackitPagination />
      {isLoading ? (
        <SkeletonTable
          variant={TableVariant.compact}
          rowsCount={perPage}
          columns={TableHeads}
        />
      ) : (
        <Table
          aria-label={`Table of ${job} sync release runs`}
          variant={TableVariant.compact}
        >
          <Thead>
            <Tr>{TableHeads}</Tr>
          </Thead>
          <Tbody>
            {data?.map((sync_release) => (
              <Tr key={sync_release.packit_id}>
                <Td dataLabel={columnNames.forge}>
                  <ForgeIcon url={sync_release.project_url} />
                </Td>
                <Td dataLabel={columnNames.trigger}>
                  <strong>
                    <TriggerLink trigger={sync_release}>
                      <TriggerSuffix trigger={sync_release} />
                    </TriggerLink>
                  </strong>
                </Td>
                <Td dataLabel={columnNames.targets}>
                  <SyncReleaseStatuses
                    statuses={sync_release.status_per_downstream_pr}
                    ids={sync_release.packit_id_per_downstream_pr}
                    job={job}
                  />
                </Td>
                <Td dataLabel={columnNames.timeSubmitted}>
                  <Timestamp stamp={sync_release.submitted_time} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </PackitPaginationContext.Provider>
  );
};
interface SyncReleaseStatusesProps {
  ids: {
    [key: string]: number;
  };
  statuses: {
    [key: string]: string;
  };
  job: SyncReleasesTableProps["job"];
}
const SyncReleaseStatuses: React.FC<SyncReleaseStatusesProps> = (props) => {
  const labels = [];

  for (const target in props.ids) {
    const id = props.ids[target];
    const status = props.statuses[target];

    labels.push(
      <SyncReleaseTargetStatusLabel
        key={id}
        link={`/jobs/${props.job}/${id}`}
        status={status}
        target={target}
      />,
    );
  }

  return <>{labels}</>;
};

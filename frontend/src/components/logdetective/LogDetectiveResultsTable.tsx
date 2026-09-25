// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { useState } from "react";

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
import { logDetectiveResultsQueryOptions } from "../../queries/logdetective/logDetectiveResultsQuery";
import { ErrorConnection } from "../errors/ErrorConnection";
import { ForgeIcon } from "../icons/ForgeIcon";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

export const LogDetectiveResultsTable = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const value = { page, setPage, perPage, setPerPage };

  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    packitId: "Packit ID",
    targets: "Targets",
    commitSha: "Commit SHA",
    timeSubmitted: "Time Submitted",
  };

  const { isLoading, isError, data } = useQuery(
    logDetectiveResultsQueryOptions(page, perPage),
  );

  const TableHeads = [
    <Th key={columnNames.forge} width={5}>
      {columnNames.forge}
    </Th>,
    <Th key={columnNames.trigger} width={15}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.packitId} width={5}>
      {columnNames.packitId}
    </Th>,
    <Th key={columnNames.targets} width={50}>
      {columnNames.targets}
    </Th>,
    <Th key={columnNames.commitSha} width={10}>
      {columnNames.commitSha}
    </Th>,
    <Th key={columnNames.timeSubmitted} width={10}>
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
          aria-label="Log Detective results"
          variant={TableVariant.compact}
        >
          <Thead>
            <Tr>{TableHeads}</Tr>
          </Thead>
          <Tbody>
            {data?.map((group) => (
              <Tr key={group.packit_id}>
                <Td dataLabel={columnNames.forge}>
                  <ForgeIcon url={group.project_url} />
                </Td>
                <Td dataLabel={columnNames.trigger}>
                  <strong>
                    <TriggerLink trigger={group}>
                      <TriggerSuffix trigger={group} />
                    </TriggerLink>
                  </strong>
                </Td>
                <Td dataLabel={columnNames.packitId}>{group.packit_id}</Td>
                <Td dataLabel={columnNames.targets}>
                  {group.log_detective_targets.map((target) => (
                    <span key={target.id}>
                      <StatusLabel
                        status={target.status}
                        target={target.target_arch}
                        link={`/jobs/log-detective/${target.id}`}
                      />
                    </span>
                  ))}
                </Td>
                <Td dataLabel={columnNames.commitSha}>
                  {group.commit_sha?.slice(0, 7)}
                </Td>
                <Td dataLabel={columnNames.timeSubmitted}>
                  <Timestamp stamp={group.submitted_time} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </PackitPaginationContext.Provider>
  );
};

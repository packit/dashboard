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
    packit_id: "Packit ID",
    analysisId: "Analysis ID",
    target: "Target",
    commitSha: "Commit SHA",
    timeSubmitted: "Time Submitted",
  };

  const { isLoading, isError, data } = useQuery(
    logDetectiveResultsQueryOptions(page, perPage),
  );

  const TableHeads = [
    <Th key={columnNames.forge} width={10}>
      {columnNames.forge}
    </Th>,
    <Th key={columnNames.trigger} width={15}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.packit_id} width={10}>
      {columnNames.packit_id}
    </Th>,
    <Th key={columnNames.analysisId} width={15}>
      {columnNames.analysisId}
    </Th>,
    <Th key={columnNames.target} width={15}>
      {columnNames.target}
    </Th>,
    <Th key={columnNames.commitSha} width={15}>
      {columnNames.commitSha}
    </Th>,
    <Th key={columnNames.timeSubmitted} width={15}>
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
            {data?.map((log_detective_result) => (
              <Tr key={log_detective_result.packit_id}>
                <Td dataLabel={columnNames.forge}>
                  <ForgeIcon url={log_detective_result.project_url} />
                </Td>
                <Td dataLabel={columnNames.trigger}>
                  <strong>
                    <TriggerLink trigger={log_detective_result}>
                      <TriggerSuffix trigger={log_detective_result} />
                    </TriggerLink>
                  </strong>
                </Td>
                <Td dataLabel={columnNames.packit_id}>
                  {log_detective_result.packit_id}
                </Td>
                <Td dataLabel={columnNames.analysisId}>
                  {log_detective_result.analysis_id}
                </Td>
                <Td dataLabel={columnNames.target}>
                  <StatusLabel
                    status={log_detective_result.status}
                    target={log_detective_result.chroot}
                    link={`/jobs/log-detective/${log_detective_result.packit_id}`}
                  />
                </Td>
                <Td dataLabel={columnNames.commitSha}>
                  {log_detective_result.commit_sha}
                </Td>
                <Td dataLabel={columnNames.timeSubmitted}>
                  <Timestamp stamp={log_detective_result.submitted_time} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </PackitPaginationContext.Provider>
  );
};

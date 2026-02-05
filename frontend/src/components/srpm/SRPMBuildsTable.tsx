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
import { srpmBuildsQueryOptions } from "../../queries/srpm/srpmBuildsQuery";
import { ErrorConnection } from "../errors/ErrorConnection";
import { ForgeIcon } from "../icons/ForgeIcon";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

export const SRPMBuildsTable = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const value = { page, setPage, perPage, setPerPage };

  const { isLoading, isError, data } = useQuery(
    srpmBuildsQueryOptions(page, perPage),
  );

  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    results: "Results",
    timeSubmitted: "Time Submitted",
  };

  const TableHeads = [
    <Th key={columnNames.forge} screenReaderText={columnNames.forge}></Th>,
    <Th key={columnNames.trigger} width={50}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.results} width={20}>
      {columnNames.results}
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
        <Table aria-label="SRPM builds" variant={TableVariant.compact}>
          <Thead>
            <Tr>{TableHeads}</Tr>
          </Thead>
          <Tbody>
            {data?.map((srpm_build) => (
              <Tr key={srpm_build.srpm_build_id}>
                <Td dataLabel={columnNames.forge}>
                  <ForgeIcon url={srpm_build.project_url} />
                </Td>
                <Td dataLabel={columnNames.trigger}>
                  <strong>
                    <TriggerLink trigger={srpm_build}>
                      <TriggerSuffix trigger={srpm_build} />
                    </TriggerLink>
                  </strong>
                </Td>
                <Td dataLabel={columnNames.results}>
                  <StatusLabel
                    status={srpm_build.status}
                    link={`/jobs/srpm/${srpm_build.srpm_build_id}`}
                  />
                </Td>
                <Td dataLabel={columnNames.timeSubmitted}>
                  <Timestamp stamp={srpm_build.submitted_time} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </PackitPaginationContext.Provider>
  );
};

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { useMemo } from "react";

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
import { useInfiniteQuery } from "@tanstack/react-query";
import { srpmBuildsQueryOptions } from "../../queries/srpm/srpmBuildsQuery";
import { ErrorConnection } from "../errors/ErrorConnection";
import { ForgeIcon } from "../icons/ForgeIcon";
import { LoadMore } from "../shared/LoadMore";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

export const SRPMBuildsTable = () => {
  const {
    isLoading,
    isError,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(srpmBuildsQueryOptions());

  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    results: "Results",
    timeSubmitted: "Time Submitted",
  };

  // Create a memoization of all the data when we flatten it out. Ideally one should render all the pages separately so that rendering will be done faster
  const rows = useMemo(() => (data ? data.pages.flat() : []), [data]);

  const TableHeads = [
    <Th key={columnNames.forge}>
      <span className="pf-v6-u-screen-reader">{columnNames.forge}</span>
    </Th>,
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

  if (isLoading) {
    return (
      <SkeletonTable
        variant={TableVariant.compact}
        rows={10}
        columns={TableHeads}
      />
    );
  }

  return (
    <>
      <Table aria-label="SRPM builds" variant={TableVariant.compact}>
        <Thead>
          <Tr>{TableHeads}</Tr>
        </Thead>
        <Tbody>
          {rows.map((srpm_build) => (
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
                <Timestamp stamp={srpm_build.build_submitted_time} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <LoadMore
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={() => void fetchNextPage()}
      />
    </>
  );
};

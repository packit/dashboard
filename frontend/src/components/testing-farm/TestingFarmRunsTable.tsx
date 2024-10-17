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
import { testingFarmRunsQueryOptions } from "../../queries/testingFarm/testingFarmRunsQuery";
import { ErrorConnection } from "../errors/ErrorConnection";
import { ForgeIcon } from "../icons/ForgeIcon";
import { LoadMore } from "../shared/LoadMore";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

export const TestingFarmRunsTable = () => {
  // Headings
  const columnNames = {
    forge: "Forge",
    testResults: "Test Results",
    trigger: "Trigger",
    target: "Target",
    timeSubmitted: "Time Submitted",
  };

  const {
    isLoading,
    isError,
    fetchNextPage,
    data,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(testingFarmRunsQueryOptions());

  // Create a memoization of all the data when we flatten it out. Ideally one should render all the pages separately so that rendering will be done faster
  const rows = useMemo(() => (data ? data.pages.flat() : []), [data]);

  const TableHeads = [
    <Th key={columnNames.forge}>
      <span className="pf-v6-u-screen-reader">{columnNames.forge}</span>
    </Th>,
    <Th key={columnNames.trigger} width={35}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.target} width={20}>
      {columnNames.target}
    </Th>,
    <Th key={columnNames.timeSubmitted} width={20}>
      {columnNames.timeSubmitted}
    </Th>,
    <Th key={columnNames.testResults} width={20}>
      {columnNames.testResults}
    </Th>,
  ];
  // Show preloader if waiting for API data
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
      <Table aria-label="Testing Farm runs" variant={TableVariant.compact}>
        <Thead>
          <Tr>{TableHeads}</Tr>
        </Thead>
        <Tbody>
          {rows.map((testing_farm_run) => (
            <Tr key={testing_farm_run.packit_id}>
              <Td dataLabel={columnNames.forge}>
                <ForgeIcon url={testing_farm_run.project_url} />
              </Td>
              <Td dataLabel={columnNames.trigger}>
                <strong>
                  <TriggerLink trigger={testing_farm_run}>
                    <TriggerSuffix trigger={testing_farm_run} />
                  </TriggerLink>
                </strong>
              </Td>
              <Td dataLabel={columnNames.target}>
                <StatusLabel
                  status={testing_farm_run.status}
                  target={testing_farm_run.target}
                  link={`/jobs/testing-farm/${testing_farm_run.packit_id}`}
                />
              </Td>
              <Td dataLabel={columnNames.timeSubmitted}>
                <Timestamp stamp={testing_farm_run.submitted_time} />
              </Td>
              <Td dataLabel={columnNames.testResults}>
                <strong>
                  <a href={testing_farm_run.web_url}>
                    {testing_farm_run.pipeline_id}
                  </a>
                </strong>
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

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
import { ErrorConnection } from "../../components/errors/ErrorConnection";
import { Timestamp } from "../../components/shared/Timestamp";
import {
  TriggerLink,
  TriggerSuffix,
} from "../../components/trigger/TriggerLink";
import { oshScansQueryOptions } from "../../queries/osh/oshScansQuery";
import { ForgeIcon } from "../icons/ForgeIcon";
import { LoadMore } from "../shared/LoadMore";
import { StatusLabel } from "../statusLabels/StatusLabel";

const OSHScansTable = () => {
  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    scanDetails: "Scan details",
    timeProcessed: "Time Processed",
    scan: "OpenScanHub task",
    newFindings: "New findings",
  };

  const {
    isLoading,
    isError,
    fetchNextPage,
    data,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(oshScansQueryOptions());

  // Create a memoization of all the data when we flatten it out. Ideally one should render all the pages separately so that rendering will be done faster
  const rows = useMemo(() => (data ? data.pages.flat() : []), [data]);

  const TableHeads = [
    <Th key={columnNames.forge}>
      <span className="pf-v6-u-screen-reader">{columnNames.forge}</span>
    </Th>,
    <Th key={columnNames.trigger} width={35}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.scanDetails} width={20}>
      {columnNames.scanDetails}
    </Th>,
    <Th key={columnNames.newFindings} width={15}>
      {columnNames.newFindings}
    </Th>,
    <Th key={columnNames.timeProcessed} width={20}>
      {columnNames.timeProcessed}
    </Th>,
    <Th key={columnNames.scan} width={20}>
      {columnNames.scan}
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
        rowsCount={10}
        columns={TableHeads}
      />
    );
  }

  return (
    <>
      <Table aria-label="OpenScanHub scans" variant={TableVariant.compact}>
        <Thead>
          <Tr>{TableHeads}</Tr>
        </Thead>
        <Tbody>
          {rows.map((scan) => (
            <Tr key={scan.packit_id}>
              <Td dataLabel={columnNames.forge}>
                <ForgeIcon url={scan.project_url} />
              </Td>
              <Td dataLabel={columnNames.trigger}>
                <strong>
                  <TriggerLink trigger={scan}>
                    <TriggerSuffix trigger={scan} />
                  </TriggerLink>
                </strong>
              </Td>
              <Td dataLabel={columnNames.scanDetails}>
                <StatusLabel
                  target={"rawhide"}
                  status={scan.status}
                  link={`/jobs/openscanhub/${scan.packit_id}`}
                />
              </Td>
              <Td dataLabel={columnNames.newFindings}>
                {scan.issues_added_count ?? "N/A"}
              </Td>
              <Td dataLabel={columnNames.timeProcessed}>
                <Timestamp stamp={scan.submitted_time} />
              </Td>
              <Td dataLabel={columnNames.scan}>
                <strong>
                  <a href={scan.url ?? ""} target="_blank" rel="noreferrer">
                    {scan.task_id}
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

export { OSHScansTable };

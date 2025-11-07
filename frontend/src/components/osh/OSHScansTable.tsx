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
import { ErrorConnection } from "../../components/errors/ErrorConnection";
import { Timestamp } from "../../components/shared/Timestamp";
import {
  TriggerLink,
  TriggerSuffix,
} from "../../components/trigger/TriggerLink";
import { oshScansQueryOptions } from "../../queries/osh/oshScansQuery";
import { ForgeIcon } from "../icons/ForgeIcon";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";
import { StatusLabel } from "../statusLabels/StatusLabel";

function getHTMLScanUrl(scanUrl: string): string {
  return scanUrl?.replace(".js?format=raw", ".html");
}

const OSHScansTable = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const value = { page, setPage, perPage, setPerPage };

  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    scanDetails: "Scan Details",
    timeProcessed: "Time Processed",
    scan: "OpenScanHub Task",
    allFindings: "All Findings",
    newFindings: "New Findings",
  };

  const { isLoading, isError, data } = useQuery(
    oshScansQueryOptions(page, perPage),
  );

  const TableHeads = [
    <Th key={columnNames.forge} screenReaderText={columnNames.forge}></Th>,
    <Th key={columnNames.trigger} width={20}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.scanDetails} width={20}>
      {columnNames.scanDetails}
    </Th>,
    <Th key={columnNames.newFindings} width={15}>
      {columnNames.newFindings}
    </Th>,
    <Th key={columnNames.timeProcessed} width={10}>
      {columnNames.timeProcessed}
    </Th>,
    <Th key={columnNames.scan} width={15}>
      {columnNames.scan}
    </Th>,
    <Th key={columnNames.allFindings} width={15}>
      {columnNames.allFindings}
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
        <Table aria-label="OpenScanHub scans" variant={TableVariant.compact}>
          <Thead>
            <Tr>{TableHeads}</Tr>
          </Thead>
          <Tbody>
            {data?.map((scan) => (
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
                <Td dataLabel={columnNames.allFindings}>
                  {scan.scan_results_url && (
                    <strong>
                      <a
                        href={getHTMLScanUrl(scan.scan_results_url)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        results
                      </a>
                    </strong>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </PackitPaginationContext.Provider>
  );
};

export { OSHScansTable };

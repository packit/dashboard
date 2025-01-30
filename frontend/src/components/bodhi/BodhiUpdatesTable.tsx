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
import { bodhiUpdatesQueryOptions } from "../../queries/bodhi/bodhiUpdatesQuery";
import { ForgeIcon, ForgeIconByForge } from "../icons/ForgeIcon";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";
import { StatusLabel } from "../statusLabels/StatusLabel";

const BodhiUpdatesTable = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const value = { page, setPage, perPage, setPerPage };

  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    branch: "Branch",
    timeProcessed: "Time Processed",
    bodhiUpdate: "Bodhi Update",
  };

  const { isLoading, isError, data } = useQuery(
    bodhiUpdatesQueryOptions(page, perPage),
  );

  const TableHeads = [
    <Th key={columnNames.forge} screenReaderText={columnNames.forge}></Th>,
    <Th key={columnNames.trigger} width={35}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.branch} width={20}>
      {columnNames.branch}
    </Th>,
    <Th key={columnNames.timeProcessed} width={20}>
      {columnNames.timeProcessed}
    </Th>,
    <Th key={columnNames.bodhiUpdate} width={20}>
      {columnNames.bodhiUpdate}
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
        <Table aria-label="Bodhi updates" variant={TableVariant.compact}>
          <Thead>
            <Tr>{TableHeads}</Tr>
          </Thead>
          <Tbody>
            {data?.map((bodhi_update) => (
              <Tr key={bodhi_update.packit_id}>
                <Td dataLabel={columnNames.forge}>
                  {bodhi_update.project_url ? (
                    <ForgeIcon url={bodhi_update.project_url} />
                  ) : (
                    <ForgeIconByForge />
                  )}
                </Td>
                <Td dataLabel={columnNames.trigger}>
                  <strong>
                    <TriggerLink trigger={bodhi_update}>
                      <TriggerSuffix trigger={bodhi_update} />
                    </TriggerLink>
                  </strong>
                </Td>
                <Td dataLabel={columnNames.branch}>
                  <StatusLabel
                    target={bodhi_update.branch}
                    status={bodhi_update.status}
                    link={`/jobs/bodhi/${bodhi_update.packit_id}`}
                  />
                </Td>
                <Td dataLabel={columnNames.timeProcessed}>
                  <Timestamp stamp={bodhi_update.submitted_time} />
                </Td>
                <Td dataLabel={columnNames.bodhiUpdate}>
                  <strong>
                    <a
                      href={bodhi_update.web_url ?? ""}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {bodhi_update.alias}
                    </a>
                  </strong>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </PackitPaginationContext.Provider>
  );
};

export { BodhiUpdatesTable };

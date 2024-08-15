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

import {
  TriggerLink,
  TriggerSuffix,
} from "../../components/trigger/TriggerLink";
import { ErrorConnection } from "../../components/errors/ErrorConnection";
import { Timestamp } from "../../components/shared/Timestamp";
import { useInfiniteQuery } from "@tanstack/react-query";
import { bodhiUpdatesQueryOptions } from "../../queries/bodhi/bodhiUpdatesQuery";
import { SkeletonTable } from "@patternfly/react-component-groups";
import { ForgeIcon, ForgeIconByForge } from "../icons/ForgeIcon";
import { LoadMore } from "../shared/LoadMore";
import { StatusLabel } from "../statusLabels/StatusLabel";

const BodhiUpdatesTable = () => {
  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    branch: "Branch",
    timeProcessed: "Time Processed",
    bodhiUpdate: "Bodhi Update",
  };

  const {
    isLoading,
    isError,
    fetchNextPage,
    data,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(bodhiUpdatesQueryOptions());

  // Create a memoization of all the data when we flatten it out. Ideally one should render all the pages separately so that rendering will be done faster
  const rows = useMemo(() => (data ? data.pages.flat() : []), [data]);

  const TableHeads = [
    <Th key={columnNames.forge}>
      <span className="pf-v5-u-screen-reader">{columnNames.forge}</span>
    </Th>,
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
      <Table aria-label="Bodhi updates" variant={TableVariant.compact}>
        <Thead>
          <Tr>{TableHeads}</Tr>
        </Thead>
        <Tbody>
          {rows.map((bodhi_update) => (
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
      <LoadMore
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={() => void fetchNextPage()}
      />
    </>
  );
};

export { BodhiUpdatesTable };

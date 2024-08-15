// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useMemo } from "react";

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
import { Timestamp } from "../../components/shared/Timestamp";
import { useInfiniteQuery } from "@tanstack/react-query";
import { kojiBuildsQueryOptions } from "../../queries/koji/kojiBuildsQuery";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { ForgeIcon } from "../icons/ForgeIcon";
import { LoadMore } from "../shared/LoadMore";
import { SkeletonTable } from "@patternfly/react-component-groups";

interface KojiBuildTableProps {
  scratch: boolean;
}
export const KojiBuildsTable: React.FC<KojiBuildTableProps> = ({ scratch }) => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(kojiBuildsQueryOptions({ scratch }));

  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    target: "Target",
    timeSubmitted: "Time Submitted",
    kojiBuildTask: "Koji Build Task",
  };

  // Create a memoization of all the data when we flatten it out. Ideally one should render all the pages separately so that rendering will be done faster
  const rows = useMemo(() => (data ? data.pages.flat() : []), [data]);

  const TableHeads = [
    <Th key={columnNames.forge}>
      <span className="pf-v5-u-screen-reader">{columnNames.forge}</span>
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
    <Th key={columnNames.kojiBuildTask} width={20}>
      {columnNames.kojiBuildTask}
    </Th>,
  ];

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
      <Table aria-label="Koji builds" variant={TableVariant.compact}>
        <Thead>
          <Tr>{TableHeads}</Tr>
        </Thead>
        <Tbody>
          {rows.map((koji_build) => (
            <Tr key={koji_build.packit_id}>
              <Td dataLabel={columnNames.forge}>
                <ForgeIcon url={koji_build.project_url} />
              </Td>
              <Td dataLabel={columnNames.trigger}>
                <strong>
                  <TriggerLink trigger={koji_build}>
                    <TriggerSuffix trigger={koji_build} />
                  </TriggerLink>
                </strong>
              </Td>
              <Td dataLabel={columnNames.target}>
                <StatusLabel
                  target={koji_build.chroot}
                  status={koji_build.status}
                  link={`/jobs/koji/${koji_build.packit_id}`}
                />
              </Td>
              <Td dataLabel={columnNames.timeSubmitted}>
                <Timestamp stamp={koji_build.build_submitted_time} />
              </Td>
              <Td dataLabel={columnNames.kojiBuildTask}>
                <strong>
                  <a href={koji_build.web_url} target="_blank" rel="noreferrer">
                    {koji_build.task_id}
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

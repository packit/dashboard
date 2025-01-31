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

import { SkeletonTable } from "@patternfly/react-component-groups";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Timestamp } from "../../components/shared/Timestamp";
import {
  TriggerLink,
  TriggerSuffix,
} from "../../components/trigger/TriggerLink";
import { kojiTagRequestsQueryOptions } from "../../queries/koji/kojiTagRequestsQuery";
import { ForgeIcon } from "../icons/ForgeIcon";
import { LoadMore } from "../shared/LoadMore";
import { StatusLabel } from "../statusLabels/StatusLabel";

export const KojiTagRequestsTable = () => {
  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    target: "Target",
    sidetag: "Sidetag",
    nvr: "NVR",
    timeSubmitted: "Time Submitted",
    kojiTagRequestTask: "Koji Tagging Request Task",
  };

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(kojiTagRequestsQueryOptions());

  // Create a memoization of all the data when we flatten it out. Ideally one should render all the pages separately so that rendering will be done faster
  const rows = useMemo(() => (data ? data.pages.flat() : []), [data]);

  const TableHeads = [
    <Th key={columnNames.forge} screenReaderText={columnNames.forge}></Th>,
    <Th key={columnNames.trigger} width={20}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.target} width={15}>
      {columnNames.target}
    </Th>,
    <Th key={columnNames.sidetag} width={15}>
      {columnNames.sidetag}
    </Th>,
    <Th key={columnNames.nvr} width={15}>
      {columnNames.nvr}
    </Th>,
    <Th key={columnNames.timeSubmitted} width={15}>
      {columnNames.timeSubmitted}
    </Th>,
    <Th key={columnNames.kojiTagRequestTask} width={15}>
      {columnNames.kojiTagRequestTask}
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
      <Table aria-label="Koji tagging requests" variant={TableVariant.compact}>
        <Thead>
          <Tr>{TableHeads}</Tr>
        </Thead>
        <Tbody>
          {rows.map((koji_tag_request) => (
            <Tr key={koji_tag_request.packit_id}>
              <Td dataLabel={columnNames.forge}>
                <ForgeIcon url={koji_tag_request.project_url} />
              </Td>
              <Td dataLabel={columnNames.trigger}>
                <strong>
                  <TriggerLink trigger={koji_tag_request}>
                    <TriggerSuffix trigger={koji_tag_request} />
                  </TriggerLink>
                </strong>
              </Td>
              <Td dataLabel={columnNames.target}>
                <StatusLabel
                  target={koji_tag_request.chroot}
                  status="unknown"
                  link={`/jobs/koji-tag-request/${koji_tag_request.packit_id}`}
                />
              </Td>
              <Td dataLabel={columnNames.sidetag}>
                <strong>
                  <a
                    href={`https://koji.fedoraproject.org/koji/search?match=exact&type=tag&terms=${koji_tag_request.sidetag}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {koji_tag_request.sidetag}
                  </a>
                </strong>
              </Td>
              <Td dataLabel={columnNames.nvr}>
                <strong>
                  <a
                    href={`https://koji.fedoraproject.org/koji/search?match=exact&type=build&terms=${koji_tag_request.nvr}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {koji_tag_request.nvr}
                  </a>
                </strong>
              </Td>
              <Td dataLabel={columnNames.timeSubmitted}>
                <Timestamp
                  stamp={koji_tag_request.tag_request_submitted_time}
                />
              </Td>
              <Td dataLabel={columnNames.kojiTagRequestTask}>
                <strong>
                  <a
                    href={koji_tag_request.web_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {koji_tag_request.task_id}
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

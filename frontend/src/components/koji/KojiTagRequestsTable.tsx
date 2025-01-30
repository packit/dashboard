// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useState } from "react";

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
import { Timestamp } from "../../components/shared/Timestamp";
import {
  TriggerLink,
  TriggerSuffix,
} from "../../components/trigger/TriggerLink";
import { kojiTagRequestsQueryOptions } from "../../queries/koji/kojiTagRequestsQuery";
import { ForgeIcon } from "../icons/ForgeIcon";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";
import { StatusLabel } from "../statusLabels/StatusLabel";

export const KojiTagRequestsTable = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const value = { page, setPage, perPage, setPerPage };

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

  const { data, isLoading } = useQuery(
    kojiTagRequestsQueryOptions(page, perPage),
  );

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
          aria-label="Koji tagging requests"
          variant={TableVariant.compact}
        >
          <Thead>
            <Tr>{TableHeads}</Tr>
          </Thead>
          <Tbody>
            {data?.map((koji_tag_request) => (
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
      )}
    </PackitPaginationContext.Provider>
  );
};

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
import { kojiBuildsQueryOptions } from "../../queries/koji/kojiBuildsQuery";
import { ForgeIcon } from "../icons/ForgeIcon";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";
import { StatusLabel } from "../statusLabels/StatusLabel";

interface KojiBuildTableProps {
  scratch: boolean;
}
export const KojiBuildsTable: React.FC<KojiBuildTableProps> = ({ scratch }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const value = { page, setPage, perPage, setPerPage };

  const { data, isLoading } = useQuery(
    kojiBuildsQueryOptions({ scratch, pageParam: page, perPage }),
  );

  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    target: "Target",
    timeSubmitted: "Time Submitted",
    kojiBuildTask: "Koji Build Task",
  };

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
    <Th key={columnNames.kojiBuildTask} width={20}>
      {columnNames.kojiBuildTask}
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
        <Table aria-label="Koji builds" variant={TableVariant.compact}>
          <Thead>
            <Tr>{TableHeads}</Tr>
          </Thead>
          <Tbody>
            {data?.map((koji_build) => (
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
                    <a
                      href={koji_build.web_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {koji_build.task_id}
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

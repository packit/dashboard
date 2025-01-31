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
import { coprBuildsQueryOptions } from "../../queries/copr/coprBuildsQuery";
import { ForgeIcon } from "../icons/ForgeIcon";
import { LoadMore } from "../shared/LoadMore";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

interface ChrootStatusesProps {
  statuses: {
    [key: string]: string;
  };
  ids: {
    [key: string]: number;
  };
}

// Add every target to the chroots column and color code according to status
const ChrootStatuses: React.FC<ChrootStatusesProps> = (props) => {
  const labels = [];

  for (const chroot in props.ids) {
    const id = props.ids[chroot];
    const status = props.statuses[chroot];

    labels.push(
      <StatusLabel
        key={chroot}
        status={status}
        target={chroot}
        link={`/jobs/copr/${id}`}
      />,
    );
  }

  return <>{labels}</>;
};

const CoprBuildsTable = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(coprBuildsQueryOptions());

  // Headings
  const columnNames = {
    forge: "Forge",
    trigger: "Trigger",
    chroots: "Chroots",
    timeSubmitted: "Time Submitted",
    coprBuild: "Copr Build",
  };

  // Create a memoization of all the data when we flatten it out. Ideally one should render all the pages separately so that rendering will be done faster
  const rows = useMemo(() => (data ? data.pages.flat() : []), [data]);

  const TableHeads = [
    <Th key={columnNames.forge} screenReaderText={columnNames.forge}></Th>,
    <Th key={columnNames.trigger} width={15}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.chroots} width={60}>
      {columnNames.chroots}
    </Th>,
    <Th key={columnNames.timeSubmitted} width={10}>
      {columnNames.timeSubmitted}
    </Th>,
    <Th key={columnNames.coprBuild} width={10}>
      {columnNames.coprBuild}
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
      <Table aria-label="Copr builds" variant={TableVariant.compact}>
        <Thead>
          <Tr>{TableHeads}</Tr>
        </Thead>
        <Tbody>
          {rows.map((copr_build) => (
            <Tr key={copr_build.build_id}>
              <Td dataLabel={columnNames.forge}>
                <ForgeIcon url={copr_build.project_url} />
              </Td>
              <Td dataLabel={columnNames.trigger}>
                <strong>
                  <TriggerLink trigger={copr_build}>
                    <TriggerSuffix trigger={copr_build} />
                  </TriggerLink>
                </strong>
              </Td>
              <Td dataLabel={columnNames.chroots}>
                <ChrootStatuses
                  statuses={copr_build.status_per_chroot}
                  ids={copr_build.packit_id_per_chroot}
                />
              </Td>
              <Td dataLabel={columnNames.timeSubmitted}>
                <Timestamp stamp={copr_build.build_submitted_time} />
              </Td>
              <Td dataLabel={columnNames.coprBuild}>
                <strong>
                  <a href={copr_build.web_url} target="_blank" rel="noreferrer">
                    {copr_build.build_id}
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

export { CoprBuildsTable };

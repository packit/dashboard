// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useMemo } from "react";

import { TableVariant, cellWidth } from "@patternfly/react-table";
import {
  Table,
  TableHeader,
  TableBody,
} from "@patternfly/react-table/deprecated";

import {
  TriggerLink,
  TriggerSuffix,
} from "../../components/trigger/TriggerLink";
import { ErrorConnection } from "../../components/errors/ErrorConnection";
import { Preloader } from "../../components/shared/Preloader";
import { Timestamp } from "../../components/shared/Timestamp";
import { useInfiniteQuery } from "@tanstack/react-query";
import { kojiBuildsQueryOptions } from "../../queries/koji/kojiBuildsQuery";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { KojiBuild } from "../../apiDefinitions";
import { ForgeIcon } from "../icons/ForgeIcon";
import { LoadMore } from "../shared/LoadMore";

interface KojiBuildTableProps {
  scratch: boolean;
}
const KojiBuildsTable: React.FC<KojiBuildTableProps> = ({ scratch }) => {
  // Headings
  const columns = [
    {
      title: <span className="pf-v5-u-screen-reader">Forge</span>,
    }, // space for forge icon
    { title: "Trigger", transforms: [cellWidth(35)] },
    { title: "Target", transforms: [cellWidth(20)] },
    { title: "Time Submitted", transforms: [cellWidth(20)] },
    { title: "Koji Build Task", transforms: [cellWidth(20)] },
  ];

  const {
    isError,
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(kojiBuildsQueryOptions({ scratch }));

  // Convert fetched json into row format that the table can read
  function jsonToRow(koji_build: KojiBuild) {
    return {
      cells: [
        {
          title: <ForgeIcon url={koji_build.project_url} />,
        },
        {
          title: (
            <strong>
              <TriggerLink trigger={koji_build}>
                <TriggerSuffix trigger={koji_build} />
              </TriggerLink>
            </strong>
          ),
        },
        {
          title: (
            <StatusLabel
              target={koji_build.chroot}
              status={koji_build.status}
              link={`/results/koji-builds/${koji_build.packit_id}`}
            />
          ),
        },
        {
          title: <Timestamp stamp={koji_build.build_submitted_time} />,
        },
        {
          title: (
            <strong>
              <a href={koji_build.web_url} target="_blank" rel="noreferrer">
                {koji_build.task_id}
              </a>
            </strong>
          ),
        },
      ],
    };
  }

  // Create a memoization of all the data when we flatten it out. Ideally one should render all the pages separately so that rendering will be done faster
  const rows = useMemo(
    () => (data ? data.pages.flat().map(jsonToRow) : []),
    [data],
  );

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  // Show preloader if waiting for API data
  // TODO(SpyTec): Replace with skeleton loader, we know the data will look like
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <Table
        aria-label="Koji builds"
        variant={TableVariant.compact}
        cells={columns}
        rows={rows}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <LoadMore
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={() => void fetchNextPage()}
      />
    </>
  );
};

export { KojiBuildsTable };

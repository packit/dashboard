// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useMemo } from "react";

import { TableVariant, cellWidth, IRow } from "@patternfly/react-table";
import {
  Table,
  TableHeader,
  TableBody,
} from "@patternfly/react-table/deprecated";

import { Button } from "@patternfly/react-core";
import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { Preloader } from "../Preloader";
import { ErrorConnection } from "../errors/ErrorConnection";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { coprBuildsOptions } from "../../queries/coprBuilds/coprQuery";
import { CoprBuild } from "../../apiDefinitions";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";
import { ForgeIcon } from "../icons/ForgeIcon";
import { Timestamp } from "../Timestamp";
import { LoadMore } from "../LoadMore";

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
        link={`/results/copr-builds/${id}`}
      />,
    );
  }

  return <>{labels}</>;
};

const CoprBuildsTable = () => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(coprBuildsOptions());

  // Headings
  const columns = [
    {
      title: <span className="pf-v5-u-screen-reader">Forge</span>,
    }, // space for forge icon
    { title: "Trigger", transforms: [cellWidth(15)] },
    { title: "Chroots", transforms: [cellWidth(60)] },
    { title: "Time Submitted", transforms: [cellWidth(10)] },
    { title: "Copr Build", transforms: [cellWidth(10)] },
  ];

  // Convert fetched json into row format that the table can read
  function jsonToRow(copr_build: CoprBuild) {
    return {
      cells: [
        {
          title: <ForgeIcon url={copr_build.project_url} />,
        },
        {
          title: (
            <strong>
              <TriggerLink trigger={copr_build}>
                <TriggerSuffix trigger={copr_build} />
              </TriggerLink>
            </strong>
          ),
        },
        {
          title: (
            <ChrootStatuses
              statuses={copr_build.status_per_chroot}
              ids={copr_build.packit_id_per_chroot}
            />
          ),
        },
        {
          title: <Timestamp stamp={copr_build.build_submitted_time} />,
        },
        {
          title: (
            <strong>
              <a href={copr_build.web_url} target="_blank" rel="noreferrer">
                {copr_build.build_id}
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

  return (
    <>
      <Table
        aria-label="Copr builds"
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

export { CoprBuildsTable };

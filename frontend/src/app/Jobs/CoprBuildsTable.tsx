import React, { useMemo } from "react";

import { TableVariant, cellWidth, IRow } from "@patternfly/react-table";
import {
  Table,
  TableHeader,
  TableBody,
} from "@patternfly/react-table/deprecated";

import { Button } from "@patternfly/react-core";
import { TriggerSuffix } from "../Trigger/TriggerLink";
import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { ForgeIcon } from "../Forge/ForgeIcon";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  let labels = [];

  for (let chroot in props.ids) {
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

// TODO(SpyTec): If needed elsewhere move out to a new folder for API bindings or something
export interface CoprBuild {
  packit_id: number;
  project: string;
  build_id: number;
  status_per_chroot: {
    [key: string]: string;
  };
  packit_id_per_chroot: {
    [key: string]: number;
  };
  build_submitted_time: number;
  web_url: string;
  ref: string;
  // TODO(SpyTec): change interface depending on status of pr_id or branch_item.
  // They seem to be mutually exclusive so can be sure one is null and other is string
  pr_id: number | null;
  branch_name: string | null;
  repo_namespace: string;
  repo_name: string;
  project_url: string;
}

const CoprBuildsTable = () => {
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

  // Fetch data from dashboard backend (or if we want, directly from the API)
  const fetchData = ({ pageParam = 1 }) =>
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/copr-builds?page=${pageParam}&per_page=20`,
    )
      .then((response) => response.json())
      .then((data) => jsonToRow(data));

  const { isInitialLoading, isError, fetchNextPage, data, isFetching } =
    useInfiniteQuery(["copr"], fetchData, {
      getNextPageParam: (_, allPages) => allPages.length + 1,
    });

  // Convert fetched json into row format that the table can read
  function jsonToRow(copr_builds: CoprBuild[]) {
    let rowsList: IRow[] = [];

    copr_builds.forEach((copr_build) => {
      let singleRow = {
        cells: [
          {
            title: <ForgeIcon url={copr_build.project_url} />,
          },
          {
            title: (
              <strong>
                <TriggerLink build={copr_build}>
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
      rowsList.push(singleRow);
    });
    return rowsList;
  }

  // Create a memoization of all the data when we flatten it out. Ideally one should render all the pages separately so that rendering will be done faster
  const rows = useMemo(() => (data ? data.pages.flat() : []), [data]);

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  // Show preloader if waiting for API data
  // TODO(SpyTec): Replace with skeleton loader, we know the data will look like
  if (isInitialLoading) {
    return <Preloader />;
  }

  return (
    <div>
      <Table
        aria-label="Copr builds"
        variant={TableVariant.compact}
        cells={columns}
        rows={rows}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <center>
        <br />
        <Button
          variant="control"
          onClick={() => fetchNextPage()}
          isAriaDisabled={isFetching}
        >
          {isFetching ? "Fetching data" : "Load more"}
        </Button>
      </center>
    </div>
  );
};

export { CoprBuildsTable };

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
import { SyncReleaseTargetStatusLabel } from "../StatusLabel/SyncReleaseTargetStatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface UpstreamDownstreamJobs {
  packit_id: number;
  status: string;
  submitted_time: number;
  status_per_downstream_pr: {
    [key: string]: string;
  };
  packit_id_per_downstream_pr: {
    [key: string]: number;
  };
  pr_id: number | null;
  issue_id: number | null;
  release: string | null;
  repo_namespace: string;
  repo_name: string;
  project_url: string;
}

interface SyncReleaseStatusesProps {
  ids: {
    [key: string]: number;
  };
  statuses: {
    [key: string]: string;
  };
  job: SyncReleaseTableProps["job"];
}
const SyncReleaseStatuses: React.FC<SyncReleaseStatusesProps> = (props) => {
  let labels = [];

  for (let target in props.ids) {
    const id = props.ids[target];
    const status = props.statuses[target];

    labels.push(
      <SyncReleaseTargetStatusLabel
        key={id}
        link={`/results/${props.job}/${id}`}
        status={status}
        target={target}
      />,
    );
  }

  return <div>{labels}</div>;
};

interface SyncReleaseTableProps {
  job: "propose-downstream" | "pull-from-upstream";
}
const SyncReleaseTable: React.FC<SyncReleaseTableProps> = ({ job }) => {
  // Headings
  const columns = [
    {
      title: <span className="pf-v5-u-screen-reader">Forge</span>,
    }, // space for forge icon
    { title: "Trigger", transforms: [cellWidth(25)] },
    { title: "Targets", transforms: [cellWidth(60)] },
    { title: "Time Submitted", transforms: [cellWidth(20)] },
  ];

  // Fetch data from dashboard backend (or if we want, directly from the API)
  const fetchData = ({ pageParam = 1 }) =>
    fetch(
      `${import.meta.env.VITE_API_URL}/${job}?page=${pageParam}&per_page=20`,
    )
      .then((response) => response.json())
      .then((data) => jsonToRow(data));

  const { isInitialLoading, isError, fetchNextPage, data, isFetching } =
    useInfiniteQuery([job], fetchData, {
      getNextPageParam: (_, allPages) => allPages.length + 1,
    });

  // Convert fetched json into row format that the table can read
  function jsonToRow(upstream_downstream_jobs: UpstreamDownstreamJobs[]) {
    let rowsList: IRow[] = [];

    upstream_downstream_jobs.forEach((upstream_downstream_job) => {
      let singleRow = {
        cells: [
          {
            title: <ForgeIcon url={upstream_downstream_job.project_url} />,
          },
          {
            title: (
              <strong>
                <TriggerLink build={upstream_downstream_job}>
                  <TriggerSuffix trigger={upstream_downstream_job} />
                </TriggerLink>
              </strong>
            ),
          },
          {
            title: (
              <SyncReleaseStatuses
                statuses={upstream_downstream_job.status_per_downstream_pr}
                ids={upstream_downstream_job.packit_id_per_downstream_pr}
                job={job}
              />
            ),
          },
          {
            title: <Timestamp stamp={upstream_downstream_job.submitted_time} />,
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
        aria-label={
          job === "pull-from-upstream"
            ? "Table of pull from upstream runs"
            : "Table of propose downstream runs"
        }
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

export { SyncReleaseTable };

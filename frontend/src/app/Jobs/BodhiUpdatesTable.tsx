// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { useMemo } from "react";

import { TableVariant, cellWidth, IRow } from "@patternfly/react-table";
import {
  Table,
  TableHeader,
  TableBody,
} from "@patternfly/react-table/deprecated";

import { Button } from "@patternfly/react-core";
import {
  TriggerLink,
  TriggerSuffix,
} from "../../components/trigger/TriggerLink";
import { ErrorConnection } from "../../components/errors/ErrorConnection";
import { Preloader } from "../../components/Preloader";
import { ForgeIcon } from "../Forge/ForgeIcon";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../../components/Timestamp";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface BodhiUpdate {
  packit_id: number;
  status: string;
  alias: string | null;
  web_url: string | null;
  branch: string;
  submitted_time: number;
  update_creation_time: number | null;
  pr_id: number | null;
  branch_name: string | null;
  release: string | null;
  project_url: string;
  repo_namespace: string;
  repo_name: string;
}
const BodhiUpdatesTable = () => {
  // Headings
  const columns = [
    {
      title: <span className="pf-v5-u-screen-reader">Forge</span>,
    }, // space for forge icon
    { title: "Trigger", transforms: [cellWidth(35)] },
    { title: "Branch", transforms: [cellWidth(20)] },
    { title: "Time Processed", transforms: [cellWidth(20)] },
    { title: "Bodhi Update", transforms: [cellWidth(20)] },
  ];

  // Fetch data from dashboard backend (or if we want, directly from the API)
  const fetchData = ({ pageParam = 1 }) =>
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/bodhi-updates?page=${pageParam}&per_page=20`,
    )
      .then((response) => response.json())
      .then((data) => jsonToRow(data));

  const { isInitialLoading, isError, fetchNextPage, data, isFetching } =
    useInfiniteQuery(["bodhi"], fetchData, {
      getNextPageParam: (_, allPages) => allPages.length + 1,
    });

  // Convert fetched json into row format that the table can read
  function jsonToRow(bodhi_updates: BodhiUpdate[]) {
    const rowsList: IRow[] = [];

    bodhi_updates.forEach((bodhi_update) => {
      const singleRow = {
        cells: [
          {
            title: <ForgeIcon url={bodhi_update.project_url} />,
          },
          {
            title: (
              <strong>
                <TriggerLink trigger={bodhi_update}>
                  <TriggerSuffix trigger={bodhi_update} />
                </TriggerLink>
              </strong>
            ),
          },
          {
            title: (
              <StatusLabel
                target={bodhi_update.branch}
                status={bodhi_update.status}
                link={`/results/bodhi-updates/${bodhi_update.packit_id}`}
              />
            ),
          },
          {
            title: <Timestamp stamp={bodhi_update.submitted_time} />,
          },
          {
            title: (
              <strong>
                <a href={bodhi_update.web_url} target="_blank" rel="noreferrer">
                  {bodhi_update.alias}
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
        aria-label="Bodhi updates"
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
          onClick={() => void fetchNextPage()}
          isAriaDisabled={isFetching}
        >
          {isFetching ? "Fetching data" : "Load more"}
        </Button>
      </center>
    </div>
  );
};

export { BodhiUpdatesTable };

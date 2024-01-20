import React, { useMemo } from "react";

import { TableVariant, cellWidth, IRow } from "@patternfly/react-table";
import {
  Table,
  TableHeader,
  TableBody,
} from "@patternfly/react-table/deprecated";

import { Button, LabelGroup } from "@patternfly/react-core";
import { TriggerLink, TriggerSuffix } from "../Trigger/TriggerLink";
import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { ForgeIcon } from "../Forge/ForgeIcon";
import { SyncReleaseTargetStatusLabel } from "../StatusLabel/SyncReleaseTargetStatusLabel";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import coprLogo from "../../static/copr.ico";
import kojiLogo from "../../static/koji.ico";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

interface StatusItem {
  packit_id: number;
  status?: string;
  target: string;
}

interface StatusItemSRPM {
  packit_id: number;
  status: string;
  target?: string;
}

interface StatusesProps {
  route: string;
  name: string | React.ReactNode;
  entries: (StatusItem | StatusItemSRPM)[];
  statusClass: typeof StatusLabel;
}

const Statuses: React.FC<StatusesProps> = (props) => {
  const labels = useMemo(() => {
    const labelled: React.ReactNode[] = [];
    props.entries.forEach((entry, i) => {
      labelled.push(
        <props.statusClass
          key={i}
          status={entry.status ?? entry.target!}
          target={entry.target}
          link={`/results/${props.route}/${entry.packit_id}`}
        />,
      );
    });
    return labelled;
  }, [props]);

  // Technically LabelGroup doesn't accept elements, only string. But the way it currently uses them works for us
  // Should be tested as part of a visual test
  return <LabelGroup categoryName={props.name as string}>{labels}</LabelGroup>;
};

interface PipelineItem {
  packit_id: number;
  target: string;
  status: string;
}

interface PipelineRun {
  merged_run_id: number;
  srpm: {
    packit_id: number;
    status: string;
  };
  copr: PipelineItem[];
  koji: PipelineItem[];
  test_run: PipelineItem[];
  propose_downstream: PipelineItem[];
  pull_from_upstream: PipelineItem[];
  time_submitted: number;
  trigger: {
    repo_namespace: string;
    repo_name: string;
    git_repo: string;
    pr_id: number | null;
    issue_id: number | null;
    branch_name: string | null;
    release: string | null;
  };
}

function getBuilderLabel(run: PipelineRun) {
  const iconStyle = {
    minWidth: "14px",
    minHeight: "14px",
    width: "14px",
    height: "14px",
  };

  let text = "none";
  let icon = undefined;

  if (run.copr.length > 0) {
    icon = <img style={iconStyle} src={coprLogo} alt="Copr logo" />;
    text = "Copr";
  } else if (run.koji.length > 0) {
    icon = <img style={iconStyle} src={kojiLogo} alt="Koji logo" />;
    text = "Koji";
  }

  return (
    <>
      {icon}&nbsp;<span>{text}</span>
    </>
  );
}

const PipelineDetail = () => {
  let { id } = useParams();
  // Headings
  const columns = [
    { title: "" }, // space for forge icon
    { title: "Trigger", transforms: [cellWidth(15)] },
    { title: "Time Submitted", transforms: [cellWidth(10)] },
    { title: "Jobs", transforms: [cellWidth(70)] },
  ];

  // Fetch data from dashboard backend (or if we want, directly from the API)
  const fetchData = ({ pageParam = 1 }) =>
    fetch(`${import.meta.env.VITE_API_URL}/runs/merged/${id}`).then(
      (response) => response.json(),
    );
  // .then((data: PipelineRun[]) => jsonToRow(data));

  const { isInitialLoading, isError, data, isFetching } = useQuery(
    ["pipeline", id],
    fetchData,
  );
  if (isFetching) return <></>;

  return <pre>{data.merged_run_id}</pre>;

  // Convert fetched json into row format that the table can read
  // function jsonToRow(res: PipelineRun[]) {
  //   const rowsList: (IRow | string[])[] = [];

  //   res.forEach((run) => {
  //     let singleRow = {
  //       cells: [
  //         {
  //           title: <ForgeIcon url={run.trigger.git_repo} />,
  //         },
  //         {
  //           title: (
  //             <strong>
  //               <a href={`pipelines/${run.merged_run_id}`}>
  //                 <TriggerSuffix trigger={run.trigger} />
  //               </a>
  //             </strong>
  //           ),
  //         },
  //         { title: <Timestamp stamp={run.time_submitted} /> },
  //         {
  //           title: (
  //             <>
  //               <Statuses
  //                 name={"SRPM"}
  //                 route={"srpm-builds"}
  //                 statusClass={StatusLabel}
  //                 entries={run.srpm ? [run.srpm] : []}
  //               />
  //               <Statuses
  //                 name={getBuilderLabel(run)}
  //                 route={"copr-builds"}
  //                 statusClass={StatusLabel}
  //                 entries={run.copr}
  //               />
  //               <Statuses
  //                 name={getBuilderLabel(run)}
  //                 route={"koji-builds"}
  //                 statusClass={StatusLabel}
  //                 entries={run.koji}
  //               />
  //               <Statuses
  //                 name={"Testing Farm"}
  //                 route={"testing-farm"}
  //                 statusClass={StatusLabel}
  //                 entries={run.test_run}
  //               />
  //               <Statuses
  //                 name={"Propose Downstream"}
  //                 route={"propose-downstream"}
  //                 statusClass={SyncReleaseTargetStatusLabel}
  //                 entries={run.propose_downstream}
  //               />
  //               <Statuses
  //                 name={"Pull From Upstream"}
  //                 route={"pull-from-upstream"}
  //                 statusClass={SyncReleaseTargetStatusLabel}
  //                 entries={run.pull_from_upstream}
  //               />
  //             </>
  //           ),
  //         },
  //       ],
  //     };
  //     rowsList.push(singleRow);
  //   });
  //   return rowsList;
  // }

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
        aria-label="Pipeline runs"
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

export { PipelineDetail };

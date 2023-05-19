import { useMemo } from "react";

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant,
    cellWidth,
    IRow,
} from "@patternfly/react-table";

import { Button } from "@patternfly/react-core";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { TriggerLink } from "../Trigger/TriggerLink";
import { Preloader } from "../Preloader/Preloader";
import { ForgeIcon } from "../Forge/ForgeIcon";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface SRPMBuild {
    srpm_build_id: number;
    status: string; // TODO(SpyTec): Probably an enum right? Change to be one if so
    log_url: string;
    build_submitted_time: number;
    repo_namespace: string;
    repo_name: string;
    project_url: string;
    // TODO(SpyTec): change interface depending on status of pr_id or branch_item.
    // They seem to be mutually exclusive so can be sure one is null and other is string
    pr_id: number | null;
    branch_name: string | null;
}

const SRPMBuildsTable = () => {
    // Headings
    const columns = [
        {
            title: <span className="pf-u-screen-reader">Forge</span>,
        }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(50)] },
        { title: "Results", transforms: [cellWidth(20)] },
        { title: "Time Submitted", transforms: [cellWidth(20)] },
    ];

    // Fetch data from dashboard backend (or if we want, directly from the API)
    const fetchData = ({ pageParam = 1 }) =>
        fetch(
            `${
                import.meta.env.VITE_API_URL
            }/srpm-builds?page=${pageParam}&per_page=20`,
        )
            .then((response) => response.json())
            .then((data) => jsonToRow(data));

    const { isInitialLoading, isError, fetchNextPage, data, isFetching } =
        useInfiniteQuery(["srpm"], fetchData, {
            getNextPageParam: (_, allPages) => allPages.length + 1,
            keepPreviousData: true,
        });

    // Convert fetched json into row format that the table can read
    function jsonToRow(srpm_builds: SRPMBuild[]) {
        let rowsList: IRow[] = [];

        srpm_builds.forEach((srpm_build) => {
            let singleRow = {
                cells: [
                    {
                        title: <ForgeIcon url={srpm_build.project_url} />,
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={srpm_build} />
                            </strong>
                        ),
                    },
                    {
                        title: (
                            <StatusLabel
                                status={srpm_build.status}
                                link={`/results/srpm-builds/${srpm_build.srpm_build_id}`}
                            />
                        ),
                    },
                    {
                        title: (
                            <Timestamp
                                stamp={srpm_build.build_submitted_time}
                            />
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
                aria-label="SRPM builds"
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

export { SRPMBuildsTable };

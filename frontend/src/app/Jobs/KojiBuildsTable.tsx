import React, { useMemo } from "react";

import { TableVariant, cellWidth, IRow } from "@patternfly/react-table";
import {
    Table,
    TableHeader,
    TableBody,
} from "@patternfly/react-table/deprecated";

import { Button } from "@patternfly/react-core";
import { TriggerLink } from "../Trigger/TriggerLink";
import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { ForgeIcon } from "../Forge/ForgeIcon";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface KojiBuild {
    packit_id: number;
    build_id: string;
    status: string; // TODO(SpyTec): Probably an enum right? Change to be one if so
    build_submitted_time: number;
    chroot: string;
    web_url: string;
    build_logs_url: string;
    // TODO(SpyTec): change interface depending on status of pr_id or branch_item.
    // They seem to be mutually exclusive so can be sure one is null and other is string
    pr_id: number | null;
    branch_name: string | null;
    release: string | null;
    project_url: string;
    repo_namespace: string;
    repo_name: string;
}

const KojiBuildsTable = () => {
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

    // Fetch data from dashboard backend (or if we want, directly from the API)
    const fetchData = ({ pageParam = 1 }) =>
        fetch(
            `${
                import.meta.env.VITE_API_URL
            }/koji-builds?page=${pageParam}&per_page=20`,
        )
            .then((response) => response.json())
            .then((data) => jsonToRow(data));

    const { isInitialLoading, isError, fetchNextPage, data, isFetching } =
        useInfiniteQuery(["koji"], fetchData, {
            getNextPageParam: (_, allPages) => allPages.length + 1,
            keepPreviousData: true,
        });

    // Convert fetched json into row format that the table can read
    function jsonToRow(koji_builds: KojiBuild[]) {
        let rowsList: IRow[] = [];

        koji_builds.forEach((koji_build) => {
            let singleRow = {
                cells: [
                    {
                        title: <ForgeIcon url={koji_build.project_url} />,
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={koji_build} />
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
                        title: (
                            <Timestamp
                                stamp={koji_build.build_submitted_time}
                            />
                        ),
                    },
                    {
                        title: (
                            <strong>
                                <a
                                    href={koji_build.web_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {koji_build.build_id}
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
                aria-label="Koji builds"
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

export { KojiBuildsTable };

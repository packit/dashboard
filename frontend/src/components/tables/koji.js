import React, { useMemo } from "react";

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant,
    cellWidth,
} from "@patternfly/react-table";

import { Button } from "@patternfly/react-core";
import TriggerLink from "../trigger_link";
import ConnectionError from "../error";
import Preloader from "../preloader";
import ForgeIcon from "../forge_icon";
import { StatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";
import { useInfiniteQuery } from "react-query";

const KojiBuildsTable = () => {
    // Headings
    const columns = [
        {
            title: <span className="pf-u-screen-reader">Forge</span>,
            transforms: [cellWidth(5)],
        }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(35)] },
        { title: "Target", transforms: [cellWidth(20)] },
        { title: "Time Submitted", transforms: [cellWidth(20)] },
        { title: "Koji Build Task", transforms: [cellWidth(20)] },
    ];

    // Fetch data from dashboard backend (or if we want, directly from the API)
    const fetchData = ({ pageParam = 1 }) =>
        fetch(
            `${process.env.REACT_APP_API_URL}/koji-builds?page=${pageParam}&per_page=20`,
        )
            .then((response) => response.json())
            .then((data) => jsonToRow(data));

    const { isLoading, isError, fetchNextPage, data, isFetching } =
        useInfiniteQuery("koji", fetchData, {
            getNextPageParam: (_, allPages) => allPages.length + 1,
            keepPreviousData: true,
        });

    // Convert fetched json into row format that the table can read
    function jsonToRow(res) {
        let rowsList = [];

        res.forEach((koji_builds) => {
            let singleRow = {
                cells: [
                    {
                        title: <ForgeIcon url={koji_builds.project_url} />,
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={koji_builds} />
                            </strong>
                        ),
                    },
                    {
                        title: (
                            <StatusLabel
                                target={koji_builds.chroot}
                                status={koji_builds.status}
                                link={`/results/koji-builds/${koji_builds.packit_id}`}
                            />
                        ),
                    },
                    {
                        title: (
                            <Timestamp
                                stamp={koji_builds.build_submitted_time}
                            />
                        ),
                    },
                    {
                        title: (
                            <strong>
                                <a
                                    href={koji_builds.web_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {koji_builds.build_id}
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
        return <ConnectionError />;
    }

    // Show preloader if waiting for API data
    // TODO(SpyTec): Replace with skeleton loader, we know the data will look like
    if (isLoading) {
        return <Preloader />;
    }

    return (
        <div>
            <Table
                aria-label="Table of Koji builds"
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

export default KojiBuildsTable;

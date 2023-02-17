import React, { useMemo } from "react";

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant,
    cellWidth,
} from "@patternfly/react-table";

import { Button } from "@patternfly/react-core";

import ConnectionError from "../error";
import TriggerLink from "../trigger_link";
import Preloader from "../preloader";
import ForgeIcon from "../forge_icon";
import { StatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";
import { useInfiniteQuery } from "react-query";

const SRPMBuildstable = () => {
    // Headings
    const columns = [
        {
            title: <span className="pf-u-screen-reader">Forge</span>,
            transforms: [cellWidth(5)],
        }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(55)] },
        { title: "Results", transforms: [cellWidth(20)] },
        { title: "Time Submitted", transforms: [cellWidth(20)] },
    ];

    // Fetch data from dashboard backend (or if we want, directly from the API)
    const fetchData = ({ pageParam = 1 }) =>
        fetch(
            `${process.env.REACT_APP_API_URL}/srpm-builds?page=${pageParam}&per_page=20`,
        )
            .then((response) => response.json())
            .then((data) => jsonToRow(data));

    const { isLoading, isError, fetchNextPage, data, isFetching } =
        useInfiniteQuery("srpm", fetchData, {
            getNextPageParam: (_, allPages) => allPages.length + 1,
            keepPreviousData: true,
        });

    // Convert fetched json into row format that the table can read
    function jsonToRow(res) {
        let rowsList = [];

        res.forEach((srpm_builds) => {
            let singleRow = {
                cells: [
                    {
                        title: <ForgeIcon url={srpm_builds.project_url} />,
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={srpm_builds} />
                            </strong>
                        ),
                    },
                    {
                        title: (
                            <StatusLabel
                                status={srpm_builds.status}
                                link={`/results/srpm-builds/${srpm_builds.srpm_build_id}`}
                            />
                        ),
                    },
                    {
                        title: (
                            <Timestamp
                                stamp={srpm_builds.build_submitted_time}
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

export default SRPMBuildstable;

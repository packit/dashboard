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
import Preloader from "../preloader";
import TriggerLink from "../trigger_link";
import ForgeIcon from "../forge_icon";
import { TFStatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";
import { useInfiniteQuery } from "react-query";

const TestingFarmResultsTable = () => {
    const columns = [
        { title: "", transforms: [cellWidth(5)] }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(35)] },
        { title: "Target", transforms: [cellWidth(20)] },
        { title: "Time Submitted", transforms: [cellWidth(20)] },
        { title: "Test Results", transforms: [cellWidth(20)] },
    ];

    // Fetch data from dashboard backend (or if we want, directly from the API)
    const fetchData = ({ pageParam = 1 }) =>
        fetch(
            `${process.env.REACT_APP_API_URL}/testing-farm/results?page=${pageParam}&per_page=50`,
        )
            .then((response) => response.json())
            .then((data) => jsonToRow(data));

    const { isLoading, isError, fetchNextPage, data, isFetching } =
        useInfiniteQuery("copr", fetchData, {
            getNextPageParam: (_, allPages) => allPages.length + 1,
            keepPreviousData: true,
        });

    function jsonToRow(res) {
        let rowsList = [];
        res.forEach((test_results) => {
            let singleRow = {
                cells: [
                    {
                        title: <ForgeIcon url={test_results.project_url} />,
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={test_results} />
                            </strong>
                        ),
                    },
                    {
                        title: (
                            <TFStatusLabel
                                status={test_results.status}
                                target={test_results.target}
                                link={`/results/testing-farm/${test_results.packit_id}`}
                            />
                        ),
                    },
                    {
                        title: (
                            <Timestamp stamp={test_results.submitted_time} />
                        ),
                    },
                    {
                        title: (
                            <strong>
                                <a href={test_results.web_url}>
                                    {test_results.pipeline_id}
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
    if (isLoading) {
        return <Preloader />;
    }

    return (
        <div>
            <Table
                aria-label="Testing Farm runs"
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

export default TestingFarmResultsTable;

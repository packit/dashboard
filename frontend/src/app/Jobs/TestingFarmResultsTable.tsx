import React, { useMemo } from "react";

import { TableVariant, cellWidth, IRow } from "@patternfly/react-table";
import {
    Table,
    TableHeader,
    TableBody,
} from "@patternfly/react-table/deprecated";

import { Button } from "@patternfly/react-core";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { ForgeIcon } from "../Forge/ForgeIcon";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface TestingFarmResult {
    packit_id: number;
    pipeline_id: string;
    ref: string;
    status: string;
    target: string;
    web_url: string;
    pr_id: number;
    submitted_time: number;
    repo_namespace: string;
    repo_name: string;
    project_url: string;
}

const TestingFarmResultsTable = () => {
    const columns = [
        { title: "" }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(35)] },
        { title: "Target", transforms: [cellWidth(20)] },
        { title: "Time Submitted", transforms: [cellWidth(20)] },
        { title: "Test Results", transforms: [cellWidth(20)] },
    ];

    // Fetch data from dashboard backend (or if we want, directly from the API)
    const fetchData = ({ pageParam = 1 }) =>
        fetch(
            `${
                import.meta.env.VITE_API_URL
            }/testing-farm/results?page=${pageParam}&per_page=50`,
        )
            .then((response) => response.json())
            .then((data) => jsonToRow(data));

    const { isInitialLoading, isError, fetchNextPage, data, isFetching } =
        useInfiniteQuery(["copr"], fetchData, {
            getNextPageParam: (_, allPages) => allPages.length + 1,
        });

    function jsonToRow(test_results: TestingFarmResult[]) {
        let rowsList: IRow[] = [];
        test_results.forEach((test_result) => {
            let singleRow = {
                cells: [
                    {
                        title: <ForgeIcon url={test_result.project_url} />,
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={test_result} />
                            </strong>
                        ),
                    },
                    {
                        title: (
                            <StatusLabel
                                status={test_result.status}
                                target={test_result.target}
                                link={`/results/testing-farm/${test_result.packit_id}`}
                            />
                        ),
                    },
                    {
                        title: <Timestamp stamp={test_result.submitted_time} />,
                    },
                    {
                        title: (
                            <strong>
                                <a href={test_result.web_url}>
                                    {test_result.pipeline_id}
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
    if (isInitialLoading) {
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

export { TestingFarmResultsTable };

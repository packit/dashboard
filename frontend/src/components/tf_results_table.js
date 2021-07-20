import React, { useState, useEffect } from "react";

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant,
    sortable,
    SortByDirection,
    cellWidth,
} from "@patternfly/react-table";

import { Button, Label, Tooltip } from "@patternfly/react-core";

import ConnectionError from "./error";
import Preloader from "./preloader";
import TriggerLink from "./trigger_link";
import ForgeIcon from "./forge_icon";

const StatusLabel = (props) => {
    let color = "purple";
    switch (props.status) {
        case "failed":
            color = "red";
            break;
        case "passed":
            color = "green";
            break;
        case "error":
            color = "orange";
            break;
    }

    return (
        <Tooltip content={props.status}>
            <Label color={color} href={props.link}>
                {props.target}
            </Label>
        </Tooltip>
    );
};

const TestingFarmResultsTable = () => {
    const column_list = [
        { title: "", transforms: [cellWidth(5)] }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(35)] },
        { title: "Target", transforms: [sortable, cellWidth(20)] },
        { title: "Time Submitted", transforms: [cellWidth(20)] },
        { title: "Results", transforms: [cellWidth(20)] },
    ];

    // Local State
    const [columns, setColumns] = useState(column_list);
    const [rows, setRows] = useState([]);
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [sortBy, setSortBy] = useState({});
    const [page, setPage] = useState(1);

    // Fetch data from dashboard backend (or if we want, directly from the API)
    function fetchData() {
        fetch(
            `${process.env.REACT_APP_API_URL}/testing-farm/results?page=${page}&per_page=50`
        )
            .then((response) => response.json())
            .then((data) => {
                jsonToRow(data);
                setLoaded(true);
                setPage(page + 1); // set next page
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }

    function jsonToRow(res) {
        let rowsList = [];
        res.map((test_results) => {
            let singleRow = {
                cells: [
                    {
                        title: (
                            <ForgeIcon projectURL={test_results.project_url} />
                        ),
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={test_results} />
                            </strong>
                        ),
                    },
                    // {
                    //     title: (
                    //         <TFLogsURL
                    //             link={test_results.web_url}
                    //             pipeline={test_results.pipeline_id}
                    //         />
                    //     ),
                    // },
                    {
                        title: (
                            <StatusLabel
                                status={test_results.status}
                                target={test_results.target}
                                link={test_results.web_url}
                            />
                        ),
                    },
                    {
                        title: test_results.submitted_time || "not provided",
                    },
                    {
                        title: (
                            <strong>
                                <a
                                    href={`/results/testing-farm/${test_results.packit_id}`}
                                >
                                    {test_results.packit_id}
                                </a>
                            </strong>
                        ),
                    },
                ],
            };
            rowsList.push(singleRow);
        });
        //   console.log(rowsList);
        setRows(rows.concat(rowsList));
    }

    function onSort(_event, index, direction) {
        const sortedRows = rows.sort((a, b) =>
            a[index] < b[index] ? -1 : a[index] > b[index] ? 1 : 0
        );
        setSortBy({
            index,
            direction,
        });
        setRows(
            direction === SortByDirection.asc
                ? sortedRows
                : sortedRows.reverse()
        );
    }

    // Load more items
    function nextPage() {
        // console.log("Next Page is " + page);
        fetchData();
    }

    // Executes fetchData on first render of component
    // look at detailed comment in ./copr_builds_table.js
    useEffect(() => {
        fetchData();
    }, []);

    // If backend API is down
    if (hasError) {
        return <ConnectionError />;
    }

    // Show preloader if waiting for API data
    if (!loaded) {
        return <Preloader />;
    }

    return (
        <div>
            <Table
                aria-label="Sortable Table"
                variant={TableVariant.compact}
                sortBy={sortBy}
                onSort={onSort}
                cells={columns}
                rows={rows}
            >
                <TableHeader />
                <TableBody />
            </Table>
            <center>
                <br />
                <Button variant="control" onClick={nextPage}>
                    Load More
                </Button>
            </center>
        </div>
    );
};

const TFLogsURL = (props) => {
    // when the testing farm test is running, there is no url stored
    // so instead of showing a fake link that leads to 404, do not show the link at all
    if (props.link !== null) {
        return (
            <a target="_blank" href={props.link}>
                {props.pipeline}
            </a>
        );
    } else {
        return <span>{props.pipeline}</span>;
    }
};

export default TestingFarmResultsTable;

import React, { useState, useEffect } from "react";

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant,
    sortable,
    SortByDirection,
} from "@patternfly/react-table";

import { Button, Label } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

import ConnectionError from "./error";
import Preloader from "./preloader";

const WebUrlIcon = (props) => {
    const handleClick = () => window.open(props.link, "_blank");
    return <ExternalLinkAltIcon onClick={handleClick} />;
};

const StatusLabel = (props) => {
    if (props.status == "failed") {
        return <Label color="red">Failed</Label>;
    } else if (props.status == "passed") {
        return <Label color="green">Passed</Label>;
    } else if (props.status == "error") {
        return <Label color="orange">Error</Label>;
    } else {
        return <Label color="purple">{props.status}</Label>;
    }
};

const TestingFarmResultsTable = () => {
    const column_list = [
        "Namespace",
        { title: "Repository", transforms: [sortable] },
        { title: "PR ID", transforms: [sortable] },
        "Pipeline",
        { title: "Chroot", transforms: [sortable] },
        { title: "Status", transforms: [sortable] },
        "Web URL",
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
        console.log(`Route is /api/testing-farm/?page=${page}&per_page=50`);
        fetch(`/api/testing-farm/?page=${page}&per_page=50`)
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
                    test_results.repo_namespace,
                    test_results.repo_name,
                    test_results.pr_id,
                    test_results.pipeline_id,
                    {
                        title: (
                            <Label color="blue">{test_results.target}</Label>
                        ),
                    },
                    {
                        title: <StatusLabel status={test_results.status} />,
                    },

                    {
                        title: <WebUrlIcon link={test_results.web_url} />,
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

export default TestingFarmResultsTable;

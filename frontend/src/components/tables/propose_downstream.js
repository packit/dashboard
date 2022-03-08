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

import { Button } from "@patternfly/react-core";
import TriggerLink from "../trigger_link";
import ConnectionError from "../error";
import Preloader from "../preloader";
import ForgeIcon from "../forge_icon";
import { ProposeDownstreamTargetStatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";

const ProposeDownstreamStatuses = (props) => {
    let labels = [];

    for (let target in props.ids) {
        const id = props.ids[target];
        const status = props.statuses[target];

        labels.push(
            <ProposeDownstreamTargetStatusLabel
                link={`/results/propose-downstream/${id}`}
                status={status}
                target={target}
            />
        );
    }

    return <div>{labels}</div>;
};

const ProposeDownstreamsTable = () => {
    // Headings
    const column_list = [
        { title: "", transforms: [cellWidth(5)] }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(25)] },
        { title: "Targets", transforms: [cellWidth(60)] },
        { title: "Time Submitted", transforms: [sortable, cellWidth(20)] },
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
            `${process.env.REACT_APP_API_URL}/propose-downstream?page=${page}&per_page=20`
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

    // Convert fetched json into row format that the table can read
    function jsonToRow(res) {
        let rowsList = [];

        res.map((propose_downstream) => {
            let singleRow = {
                cells: [
                    {
                        title: (
                            <ForgeIcon url={propose_downstream.project_url} />
                        ),
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={propose_downstream} />
                            </strong>
                        ),
                    },
                    {
                        title: (
                            <ProposeDownstreamStatuses
                                statuses={
                                    propose_downstream.status_per_downstream_pr
                                }
                                ids={
                                    propose_downstream.packit_id_per_downstream_pr
                                }
                            />
                        ),
                    },
                    {
                        title: (
                            <Timestamp
                                stamp={propose_downstream.submitted_time}
                            />
                        ),
                    },
                ],
            };
            rowsList.push(singleRow);
        });
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

export default ProposeDownstreamsTable;

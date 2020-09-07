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
import TriggerLink from "./trigger_link";
import Preloader from "./preloader";
import ForgeIcon from "./forge_icon";

const SRPMBuildstable = () => {
    // Headings
    const column_list = [
        { title: "Forge", transforms: [cellWidth(10)] }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(15)] },
        { title: "Success", transforms: [cellWidth(10)] },
        { title: "Time Submitted", transforms: [cellWidth(15)] },
        { title: "ID", transforms: [sortable, cellWidth(10)] },
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
        fetch(`${apiURL}/srpm-builds?page=${page}&per_page=20`)
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

        res.map((srpm_builds) => {
            let singleRow = {
                cells: [
                    {
                        title: (
                            <ForgeIcon projectURL={srpm_builds.project_url} />
                        ),
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={srpm_builds} />
                            </strong>
                        ),
                    },
                    {
                        title: <StatusLabel success={srpm_builds.success} />,
                    },
                    {
                        title: <span>{srpm_builds.build_submitted_time}</span>,
                    },
                    {
                        title: (
                            <strong>
                                <a target="_blank" href={srpm_builds.log_url}>
                                    {srpm_builds.srpm_build_id}
                                </a>
                            </strong>
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
                <Button variant="control" onClick={fetchData}>
                    Load More
                </Button>
            </center>
        </div>
    );
};

const StatusLabel = (props) => {
    if (props.success == true) {
        return <Label color="green">Success</Label>;
    } else {
        return <Label color="red">Failed</Label>;
    }
};

export default SRPMBuildstable;

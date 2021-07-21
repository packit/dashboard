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
import TriggerLink from "./trigger_link";
import ConnectionError from "./error";
import Preloader from "./preloader";
import ForgeIcon from "./forge_icon";
import ChrootStatus from "./chroot_status";

const KojiBuildsTable = () => {
    // Headings
    const column_list = [
        "", // no title, empty space for the forge icon
        { title: "Trigger", transforms: [cellWidth(25)] },
        "Chroot",
        { title: "Time Submitted", transforms: [sortable, cellWidth(15)] },
        { title: "Build Logs", transforms: [sortable, cellWidth(15)] },
        "Results",
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
            `${process.env.REACT_APP_API_URL}/koji-builds?page=${page}&per_page=20`
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

        res.map((koji_builds) => {
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
                            <ChrootStatus
                                chroot={koji_builds.chroot}
                                status={koji_builds.status}
                            />
                        ),
                    },
                    koji_builds.build_submitted_time,
                    {
                        title: (
                            <strong>
                                <a href={koji_builds.web_url} target="_blank">
                                    {koji_builds.build_id}
                                </a>
                            </strong>
                        ),
                    },
                    {
                        title: (
                            <strong>
                                <a
                                    href={
                                        "/results/koji-builds/" +
                                        koji_builds.packit_id
                                    }
                                >
                                    {koji_builds.packit_id}
                                </a>
                            </strong>
                        ),
                    },
                ],
            };
            rowsList.push(singleRow);
        });
        // console.log(rowsList);
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

export default KojiBuildsTable;

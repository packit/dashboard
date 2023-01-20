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
import { StatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";

const KojiBuildsTable = () => {
    // Headings
    const columns = [
        { title: "", transforms: [cellWidth(5)] }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(35)] },
        { title: "Target", transforms: [sortable, cellWidth(20)] },
        { title: "Time Submitted", transforms: [cellWidth(20)] },
        { title: "Koji Build Task", transforms: [cellWidth(20)] },
    ];

    // Local State
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

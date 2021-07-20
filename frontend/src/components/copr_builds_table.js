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

// Add every target to the chroots column and color code according to status
const ChrootStatuses = (props) => {
    let labels = [];

    for (let chroot in props.ids) {
        const id = props.ids[chroot];
        const status = props.statuses[chroot];

        let color = "purple";
        switch (status) {
            case "success":
                color = "green";
                break;
            case "failure":
                color = "red";
                break;
        }

        labels.push(
            <Tooltip content={status}>
                <span style={{ padding: "2px" }}>
                    <Label color={color} href={"/results/copr-builds/" + id}>
                        {chroot}
                    </Label>
                </span>
            </Tooltip>
        );
    }

    console.log(labels);
    return <div>{labels}</div>;
};

const CoprBuildsTable = () => {
    // Headings
    const column_list = [
        { title: "", transforms: [cellWidth(5)] }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(15)] },
        { title: "Chroots", transforms: [cellWidth(60)] },
        { title: "Time Submitted", transforms: [sortable, cellWidth(10)] },
        { title: "COPR Build ID", transforms: [sortable, cellWidth(10)] },
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
            `${process.env.REACT_APP_API_URL}/copr-builds?page=${page}&per_page=20`
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

        res.map((copr_builds) => {
            let singleRow = {
                cells: [
                    {
                        title: (
                            <ForgeIcon projectURL={copr_builds.project_url} />
                        ),
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={copr_builds} />
                            </strong>
                        ),
                    },
                    {
                        title: (
                            <ChrootStatuses
                                statuses={copr_builds.status_per_chroot}
                                ids={copr_builds.packit_id_per_chroot}
                            />
                        ),
                    },
                    copr_builds.build_submitted_time,
                    {
                        title: (
                            <strong>
                                <a href={copr_builds.web_url} target="_blank">
                                    {copr_builds.build_id}
                                </a>
                            </strong>
                        ),
                    },
                    // copr_builds.ref.substring(0, 8),
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

    // Load more items
    function nextPage() {
        // console.log("Next Page is " + page);
        fetchData();
    }

    // useEffect by default executes on every render of component
    // here we only need it to execute on mount / first render
    // so I simply added the second parameter (empty array three lines after this comment)

    // But if you want different behaviour for first render and updated render
    // look at https://stackoverflow.com/a/55075818/3809115
    // and add code after the last line of the if statement in the ans

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

export default CoprBuildsTable;

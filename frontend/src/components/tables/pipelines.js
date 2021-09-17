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

import { Button, Label, LabelGroup, Tooltip } from "@patternfly/react-core";
import TriggerLink from "../trigger_link";
import ConnectionError from "../error";
import Preloader from "../preloader";
import ForgeIcon from "../forge_icon";
import { StatusLabel, toSRPMStatus, TFStatusLabel } from "../status_labels";
import coprLogo from "../../static/copr.ico";
import kojiLogo from "../../static/koji.ico";

class Statuses extends React.Component {
    constructor(props) {
        super(props);

        this.labels = [];
        for (let entry of props.entries) {
            this.labels.push(
                <props.statusClass
                    status={entry.status}
                    chroot={entry.target}
                    target={entry.target}
                    link={`results/${props.route}/${entry.packit_id}`}
                />
            );
        }
    }

    render() {
        return <LabelGroup>{this.labels}</LabelGroup>;
    }
}

function getBuilderLabel(run) {
    const iconStyle = {
        minWidth: "14px",
        minHeight: "14px",
        width: "14px",
        height: "14px",
    };

    let text = "none";
    let icon = undefined;

    if (run.copr.length > 0) {
        icon = <img style={iconStyle} src={coprLogo} />;
        text = "Copr";
    } else if (run.koji.length > 0) {
        icon = <img style={iconStyle} src={kojiLogo} />;
        text = "Koji";
    }

    return (
        <Label variant={"outline"} icon={icon}>
            {text}
        </Label>
    );
}

const PipelinesTable = () => {
    // Headings
    const column_list = [
        { title: "", transforms: [cellWidth(5)] }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(15)] },
        { title: "Time Submitted", transforms: [sortable, cellWidth(10)] },
        { title: "SRPM", transforms: [cellWidth(5)] },
        { title: "Built by", transforms: [cellWidth(5)] },
        { title: "RPM builds", transforms: [cellWidth(30)] },
        { title: "Testing Farm", transforms: [cellWidth(30)] },
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
        fetch(`${process.env.REACT_APP_API_URL}/runs?page=${page}&per_page=20`)
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

        res.map((run) => {
            let singleRow = {
                cells: [
                    {
                        title: <ForgeIcon url={run.trigger.git_repo} />,
                    },
                    {
                        title: (
                            <strong>
                                <TriggerLink builds={run.trigger} />
                            </strong>
                        ),
                    },
                    run.time_submitted,
                    {
                        title: (
                            <StatusLabel
                                status={toSRPMStatus(run.srpm.success)}
                                link={`/results/srpm-builds/${run.srpm.packit_id}`}
                            />
                        ),
                    },
                    {
                        title: getBuilderLabel(run),
                    },
                    {
                        title: (
                            <>
                                <Statuses
                                    route={"copr-builds"}
                                    statusClass={StatusLabel}
                                    entries={run.copr}
                                />
                                <Statuses
                                    route={"koji-builds"}
                                    statusClass={StatusLabel}
                                    entries={run.koji}
                                />
                            </>
                        ),
                    },
                    {
                        title: (
                            <Statuses
                                route={"testing-farm"}
                                statusClass={TFStatusLabel}
                                entries={run.test_run}
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

export default PipelinesTable;

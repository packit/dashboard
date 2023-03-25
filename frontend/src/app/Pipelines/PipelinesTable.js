import React, { useMemo } from "react";

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant,
    cellWidth,
} from "@patternfly/react-table";

import { Button, LabelGroup } from "@patternfly/react-core";
import { TriggerLink } from "../Trigger/TriggerLink";
import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { ForgeIcon } from "../Forge/ForgeIcon";
import { SyncReleaseTargetStatusLabel } from "../StatusLabel/SyncReleaseTargetStatusLabel";
import { TFStatusLabel } from "../StatusLabel/TFStatusLabel";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/time";
import coprLogo from "../../static/copr.ico";
import kojiLogo from "../../static/koji.ico";
import { useInfiniteQuery } from "react-query";

class Statuses extends React.Component {
    constructor(props) {
        super(props);

        this.name = props.name;

        this.labels = [];
        props.entries.forEach((entry, i) => {
            this.labels.push(
                <props.statusClass
                    key={i}
                    status={entry.status}
                    chroot={entry.target}
                    target={entry.target}
                    link={`/results/${props.route}/${entry.packit_id}`}
                />,
            );
        });
    }

    render() {
        return <LabelGroup categoryName={this.name}>{this.labels}</LabelGroup>;
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
        icon = <img style={iconStyle} src={coprLogo} alt="Copr logo" />;
        text = "Copr";
    } else if (run.koji.length > 0) {
        icon = <img style={iconStyle} src={kojiLogo} alt="Koji logo" />;
        text = "Koji";
    }

    return (
        <>
            {icon}&nbsp;<span>{text}</span>
        </>
    );
}

const PipelinesTable = () => {
    // Headings
    const columns = [
        { title: "", transforms: [cellWidth(5)] }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(15)] },
        { title: "Time Submitted", transforms: [cellWidth(10)] },
        { title: "Jobs", transforms: [cellWidth(70)] },
    ];

    // Fetch data from dashboard backend (or if we want, directly from the API)
    const fetchData = ({ pageParam = 1 }) =>
        fetch(
            `${process.env.REACT_APP_API_URL}/runs?page=${pageParam}&per_page=20`,
        )
            .then((response) => response.json())
            .then((data) => jsonToRow(data));

    const { isLoading, isError, fetchNextPage, data, isFetching } =
        useInfiniteQuery("pipelines", fetchData, {
            getNextPageParam: (_, allPages) => allPages.length + 1,
            keepPreviousData: true,
        });

    // Convert fetched json into row format that the table can read
    function jsonToRow(res) {
        let rowsList = [];

        res.forEach((run) => {
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
                    { title: <Timestamp stamp={run.time_submitted} /> },
                    {
                        title: (
                            <>
                                <Statuses
                                    name={"SRPM"}
                                    route={"srpm-builds"}
                                    statusClass={StatusLabel}
                                    entries={run.srpm ? [run.srpm] : []}
                                />
                                <Statuses
                                    name={getBuilderLabel(run)}
                                    route={"copr-builds"}
                                    statusClass={StatusLabel}
                                    entries={run.copr}
                                />
                                <Statuses
                                    name={getBuilderLabel(run)}
                                    route={"koji-builds"}
                                    statusClass={StatusLabel}
                                    entries={run.koji}
                                />
                                <Statuses
                                    name={"Testing Farm"}
                                    route={"testing-farm"}
                                    statusClass={TFStatusLabel}
                                    entries={run.test_run}
                                />
                                <Statuses
                                    name={"Propose Downstream"}
                                    route={"propose-downstream"}
                                    statusClass={SyncReleaseTargetStatusLabel}
                                    entries={run.propose_downstream}
                                />
                                <Statuses
                                    name={"Pull From Upstream"}
                                    route={"pull-from-upstream"}
                                    statusClass={SyncReleaseTargetStatusLabel}
                                    entries={run.pull_from_upstream}
                                />
                            </>
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
    // TODO(SpyTec): Replace with skeleton loader, we know the data will look like
    if (isLoading) {
        return <Preloader />;
    }

    return (
        <div>
            <Table
                aria-label="Pipeline runs"
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

export { PipelinesTable };

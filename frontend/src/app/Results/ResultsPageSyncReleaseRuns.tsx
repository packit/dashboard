import React from "react";
import {
    PageSection,
    Card,
    CardBody,
    PageSectionVariants,
    TextContent,
    Text,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
} from "@patternfly/react-core";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { SyncReleaseTargetStatusLabel } from "../StatusLabel/SyncReleaseTargetStatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { LogViewer, LogViewerSearch } from "@patternfly/react-log-viewer";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { useQuery } from "@tanstack/react-query";

interface ResultsPageSyncReleaseRunsProps {
    job: "propose-downstream" | "pull-from-upstream";
}

interface SyncReleaseRun {
    status: string;
    branch: string;
    downstream_pr_url: string;
    submitted_time: number;
    start_time: number;
    finished_time: number;
    logs: string;
    repo_namespace: string;
    repo_name: string;
    git_repo: string;
    pr_id: number | null;
    issue_id: number | null;
    branch_name: string | null;
    release: string | null;
}

const fetchSyncRelease = (url: string) =>
    fetch(url).then((response) => {
        if (!response.ok && response.status !== 404) {
            throw Promise.reject(response);
        }
        return response.json();
    });

const ResultsPageSyncReleaseRuns: React.FC<ResultsPageSyncReleaseRunsProps> = ({
    job,
}) => {
    const displayText =
        job === "pull-from-upstream"
            ? "Pull from upstream results"
            : "Propose downstream results";
    useTitle(displayText);
    let { id } = useParams();

    const URL = `${import.meta.env.VITE_API_URL}/${job}/${id}`;
    const { data, isError, isInitialLoading } = useQuery<
        SyncReleaseRun | { error: string }
    >([URL], () => fetchSyncRelease(URL));

    // If backend API is down
    if (isError) {
        return <ErrorConnection />;
    }

    // Show preloader if waiting for API data
    if (isInitialLoading || data === undefined) {
        return <Preloader />;
    }

    if ("error" in data) {
        return (
            <PageSection>
                <Card>
                    <CardBody>
                        <Title headingLevel="h1" size="lg">
                            Not Found.
                        </Title>
                    </CardBody>
                </Card>
            </PageSection>
        );
    }

    const linkToDownstreamPR = data.downstream_pr_url ? (
        <a href={data.downstream_pr_url}>Click here</a>
    ) : (
        <>Link will be available after successful downstream PR submission.</>
    );

    const logs = (
        <PageSection>
            <Card>
                <CardBody>
                    <LogViewer
                        data={
                            data.logs ? data.logs : "Log is not available yet."
                        }
                        toolbar={
                            <Toolbar>
                                <ToolbarContent>
                                    <ToolbarItem>
                                        <LogViewerSearch
                                            placeholder="Search value"
                                            minSearchChars={3}
                                        />
                                    </ToolbarItem>
                                </ToolbarContent>
                            </Toolbar>
                        }
                        hasLineNumbers={false}
                    />
                </CardBody>
            </Card>
        </PageSection>
    );

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">{displayText}</Text>
                    <SyncReleaseTargetStatusLabel
                        status={data.status}
                        target={data.branch}
                        link={data.downstream_pr_url}
                    />
                    <Text component="p">
                        <strong>
                            <TriggerLink builds={data} />
                        </strong>
                        <br />
                    </Text>
                </TextContent>
            </PageSection>

            <PageSection>
                <Card>
                    <CardBody>
                        {/* TODO: Change to PatternFly table component */}
                        <table
                            className="pf-c-table pf-m-compact pf-m-grid-md"
                            role="grid"
                            aria-label="Sync release table"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Status</strong>
                                    </td>
                                    <td>{data.status}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Submission Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.submitted_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Start Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.start_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Finish Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.finished_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Link to downstream PR</strong>
                                    </td>
                                    <td>{linkToDownstreamPR}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </PageSection>
            {logs}
        </div>
    );
};

export { ResultsPageSyncReleaseRuns };

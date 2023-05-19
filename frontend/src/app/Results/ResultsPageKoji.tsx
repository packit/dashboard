import React from "react";
import {
    PageSection,
    Card,
    CardBody,
    PageSectionVariants,
    TextContent,
    Text,
    Title,
} from "@patternfly/react-core";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { useQuery } from "@tanstack/react-query";

interface KojiBuild {
    build_id: string;
    status: string;
    chroot: string;
    build_start_time: number;
    build_finished_time: number;
    build_submitted_time: number;
    commit_sha: string;
    web_url: string;
    build_logs_url: string;
    srpm_build_id: number;
    run_ids: number[];
    repo_namespace: string;
    repo_name: string;
    git_repo: string;
    pr_id: number | null;
    issue_id: number | null;
    branch_name: string | null;
    release: string | null;
}

const fetchKojiBuilds = (url: string) =>
    fetch(url).then((response) => {
        if (!response.ok && response.status !== 404) {
            throw Promise.reject(response);
        }
        return response.json();
    });

const ResultsPageKoji = () => {
    useTitle("Koji Results");
    let { id } = useParams();

    const URL = `${import.meta.env.VITE_API_URL}/koji-builds/${id}`;
    const { data, isError, isInitialLoading } = useQuery<
        KojiBuild | { error: string }
    >([URL], () => fetchKojiBuilds(URL));

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

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Koji Build Results</Text>
                    <StatusLabel
                        target={data.chroot}
                        status={data.status}
                        link={data.web_url}
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
                            aria-label="Builds Table"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>SRPM Build</strong>
                                    </td>
                                    <td>
                                        <a
                                            href={`/results/srpm-builds/${data.srpm_build_id}`}
                                        >
                                            SRPM Logs
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Koji URL</strong>
                                    </td>
                                    <td>
                                        <a href={data.web_url}>Web URL</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Build Logs</strong>
                                    </td>
                                    <td>
                                        <a href={data.build_logs_url}>
                                            Build Logs URL
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <strong>Build Submission Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.build_submitted_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Build Start Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.build_start_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Build Finish Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.build_finished_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Commit SHA</strong>
                                    </td>
                                    <td>{data.commit_sha}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export { ResultsPageKoji };

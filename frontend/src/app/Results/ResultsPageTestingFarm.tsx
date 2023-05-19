import React from "react";
import {
    PageSection,
    Card,
    CardBody,
    PageSectionVariants,
    TextContent,
    Text,
    Title,
    Label,
} from "@patternfly/react-core";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { TFStatusLabel } from "../StatusLabel/TFStatusLabel";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { useQuery } from "@tanstack/react-query";

export interface TestingFarmOverview {
    pipeline_id: string; // UUID
    status: string;
    chroot: string;
    commit_sha: string;
    web_url: string;
    copr_build_ids: number[];
    run_ids: number[];
    submitted_time: number;
    repo_namespace: string;
    repo_name: string;
    git_repo: string;
    pr_id: number | null;
    issue_id: number | null;
    branch_name: string | null;
    release: string | null;
}

function getCoprBuilds(copr_build_ids: number[]) {
    let coprBuilds = [];
    let title = copr_build_ids.length === 1 ? "Copr build" : "Copr builds";

    for (var i = 0; i < copr_build_ids.length; i++) {
        var coprBuildId = copr_build_ids[i];
        var linkText =
            copr_build_ids.length === 1 ? "Details" : `Build ${i + 1}  `;
        coprBuilds.push(
            <Label href={`/results/copr-builds/${coprBuildId}`}>
                {linkText}
            </Label>,
        );
    }

    return (
        <tr>
            <td>
                <strong>{title}</strong>
            </td>
            <td>{coprBuilds}</td>
        </tr>
    );
}

const fetchTestingFarm = (
    url: string,
): Promise<TestingFarmOverview | { error: string }> =>
    fetch(url).then((response) => {
        if (!response.ok && response.status !== 404) {
            throw Promise.reject(response);
        }
        return response.json();
    });

const ResultsPageTestingFarm = () => {
    useTitle("Testing Farm Results");
    let { id } = useParams();

    const URL = `${import.meta.env.VITE_API_URL}/testing-farm/${id}`;
    const { data, isError, isInitialLoading } = useQuery([URL], () =>
        fetchTestingFarm(URL),
    );

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

    const statusWithLink = data.web_url ? (
        <a href={data.web_url}>{data.status}</a>
    ) : (
        <>{data.status}</>
    );

    data.copr_build_ids = data.copr_build_ids.filter((copr) => copr !== null);
    const coprBuildInfo =
        data.copr_build_ids.length > 0
            ? getCoprBuilds(data.copr_build_ids)
            : "";

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Testing Farm Results</Text>
                    <TFStatusLabel
                        status={data.status}
                        target={data.chroot}
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
                            aria-label="Testing farm table"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Status</strong>
                                    </td>
                                    <td>{statusWithLink}</td>
                                </tr>
                                {coprBuildInfo}
                                <tr>
                                    <td>
                                        <strong>Pipeline ID</strong>
                                    </td>
                                    <td>{data.pipeline_id}</td>
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

export { ResultsPageTestingFarm };

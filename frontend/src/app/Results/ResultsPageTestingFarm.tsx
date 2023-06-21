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
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
} from "@patternfly/react-core";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { getCommitLink } from "../utils/forgeUrls";
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
        <>
            <DescriptionListTerm>{title}</DescriptionListTerm>
            <DescriptionListDescription>
                {coprBuilds}
            </DescriptionListDescription>
        </>
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
        <a href={data.web_url} target="_blank" rel="noreferrer">
            {data.status}
        </a>
    ) : (
        <>{data.status}</>
    );

    data.copr_build_ids = data.copr_build_ids.filter((copr) => copr !== null);
    const coprBuildInfo =
        data.copr_build_ids.length > 0
            ? getCoprBuilds(data.copr_build_ids)
            : "";

    return (
        <>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Testing Farm Results</Text>
                    <StatusLabel
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
                        <DescriptionList
                            columnModifier={{
                                default: "1Col",
                                sm: "2Col",
                            }}
                        >
                            <DescriptionListGroup>
                                <DescriptionListTerm>
                                    Status
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                    {statusWithLink}
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                {coprBuildInfo}
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>
                                    Pipeline ID
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                    <a
                                        href={data.web_url}
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        {data.pipeline_id}
                                    </a>
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                                <DescriptionListTerm>
                                    Commit SHA
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                    <a
                                        href={getCommitLink(
                                            data.git_repo,
                                            data.commit_sha,
                                        )}
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        {data.commit_sha}
                                    </a>
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                        </DescriptionList>
                    </CardBody>
                </Card>
            </PageSection>
        </>
    );
};

export { ResultsPageTestingFarm };

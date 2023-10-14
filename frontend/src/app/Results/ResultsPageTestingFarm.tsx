import React, { useEffect, useState } from "react";
import {
    PageSection,
    Card,
    CardBody,
    PageSectionVariants,
    TextContent,
    Text,
    Title,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    DataList,
    DataListItemRow,
    DataListItem,
    DataListContent,
    DataListItemCells,
    DataListCell,
    DataListToggle,
    ClipboardCopy,
} from "@patternfly/react-core";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { TriggerLink } from "../Trigger/TriggerLink";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { NavLink, useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { Timestamp } from "../utils/Timestamp";
import { getCommitLink } from "../utils/forgeUrls";
import {
    QueriesOptions,
    UseQueryResult,
    useQueries,
    useQuery,
} from "@tanstack/react-query";
import {
    API_COPR_BUILDS,
    CoprResult,
    fetchSyncRelease,
} from "./ResultsPageCopr";
import { Preloader } from "../Preloader/Preloader";
import { ResultsPageCoprDetails } from "./ResultsPageCoprDetails";
import { SHACopy } from "../utils/SHACopy";

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

/**
 * @param copr_build_ids List of Copr builds to display
 * @returns Expandable Copr list that fetches detail on expansion
 */
function useCoprBuilds(copr_build_ids: number[]): React.JSX.Element[] {
    let coprBuilds = [];

    const [expandedBuilds, setExpandedBuilds] = useState<number[]>([]);
    const [coprQueries, setCoprQueries] = useState<[...QueriesOptions<any>]>(
        [],
    );
    type QueryResult = UseQueryResult<CoprResult | { error: string }>;
    const results = useQueries<(CoprResult | { error: string })[]>({
        queries: coprQueries,
    }) as QueryResult[];
    useEffect(() => {
        const queries: typeof coprQueries = [];
        copr_build_ids.forEach((id) => {
            const URL = API_COPR_BUILDS + id;
            queries.push({
                queryKey: [URL],
                queryFn: () => fetchSyncRelease(URL),
                enabled: expandedBuilds.includes(id),
                staleTime: Infinity,
            });
        });
        setCoprQueries(queries);
    }, [copr_build_ids, expandedBuilds]);

    const toggleExpand = (id: number) => {
        if (expandedBuilds.includes(id)) {
            setExpandedBuilds(
                expandedBuilds.filter((expandedBuild) => id !== expandedBuild),
            );
        } else {
            setExpandedBuilds([...expandedBuilds, id]);
        }
    };

    const coprDetails = results.map((result) => {
        if (!result.data || typeof result.data !== "object")
            return <>Loading</>;
        if ("error" in result.data) {
            return <>Error {result.data["error"]}</>;
        } else if ("build_id" in result.data) {
            return <ResultsPageCoprDetails data={result.data} />;
        }
    });
    for (let i = 0; i < copr_build_ids.length; i++) {
        let coprBuildId = copr_build_ids[i];
        let isExpanded = expandedBuilds.includes(coprBuildId);
        coprBuilds.push(
            <DataListItem key={coprBuildId} isExpanded={isExpanded}>
                <DataListItemRow key={coprBuildId + "row"}>
                    <DataListToggle
                        isExpanded={isExpanded}
                        id={`copr-build-toggle${coprBuildId}`}
                        aria-controls={`copr-build-expand${coprBuildId}`}
                        onClick={() => toggleExpand(coprBuildId)}
                    />
                    <DataListItemCells
                        dataListCells={[
                            <DataListCell>
                                <NavLink
                                    to={`/results/copr-builds/${coprBuildId}`}
                                >
                                    {coprBuildId}
                                </NavLink>
                            </DataListCell>,
                        ]}
                    ></DataListItemCells>
                </DataListItemRow>
                <DataListContent
                    key={coprBuildId + "content"}
                    aria-label="Copr build detail"
                    isHidden={!isExpanded}
                    id={`copr-build-expand${coprBuildId}`}
                >
                    {coprDetails}
                </DataListContent>
            </DataListItem>,
        );
    }
    return coprBuilds;
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
    const [coprBuildIds, setCoprBuildIds] = useState<number[]>([]);
    const coprBuilds = useCoprBuilds(coprBuildIds);
    useEffect(() => {
        if (data && "copr_build_ids" in data) {
            setCoprBuildIds(
                data?.copr_build_ids.filter((copr) => copr !== null),
            );
        }
    }, [data]);
    // If backend API is down
    if (isError) {
        return <ErrorConnection />;
    }

    // // Show preloader if waiting for API data
    // if (isInitialLoading || data === undefined) {
    //     return ;
    // }

    if (data && "error" in data) {
        return;
    }

    const statusWithLink = data?.web_url ? (
        <a href={data.web_url} target="_blank" rel="noreferrer">
            {data.status}
        </a>
    ) : (
        <>{data?.status}</>
    );

    return (
        <>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Testing Farm Results</Text>

                    <Text component="p">
                        <strong>
                            {data ? (
                                <>
                                    <TriggerLink builds={data} />
                                    <SHACopy
                                        git_repo={data.git_repo}
                                        commit_sha={data.commit_sha}
                                    />
                                </>
                            ) : (
                                <></>
                            )}
                        </strong>
                        <br />
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <Card>
                    {!data ? (
                        isInitialLoading || data === undefined ? (
                            <Preloader />
                        ) : (
                            <PageSection>
                                <Card>
                                    <CardBody>
                                        <Title headingLevel="h1" size="lg">
                                            Not Found.
                                        </Title>
                                    </CardBody>
                                </Card>
                            </PageSection>
                        )
                    ) : (
                        <>
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
                                            <StatusLabel
                                                status={data.status}
                                                target={data.chroot}
                                                link={data.web_url}
                                            />
                                        </DescriptionListDescription>
                                        <DescriptionListTerm>
                                            Pipeline ID
                                        </DescriptionListTerm>
                                        <DescriptionListDescription>
                                            <ClipboardCopy
                                                isReadOnly
                                                hoverTip="Copy"
                                                clickTip="Copied"
                                                variant="inline-compact"
                                            >
                                                {data.pipeline_id}
                                            </ClipboardCopy>
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>
                                            Run Submitted Time
                                        </DescriptionListTerm>
                                        <DescriptionListDescription>
                                            <Timestamp
                                                stamp={data.submitted_time}
                                                verbose={true}
                                            />
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                </DescriptionList>
                            </CardBody>
                            <CardBody>
                                <DescriptionList>
                                    <DescriptionListGroup>
                                        <DescriptionListTerm>
                                            Copr Build(s)
                                        </DescriptionListTerm>
                                        <DescriptionListDescription>
                                            <DataList aria-label="Copr builds">
                                                {coprBuilds}
                                            </DataList>
                                        </DescriptionListDescription>
                                    </DescriptionListGroup>
                                </DescriptionList>
                            </CardBody>
                        </>
                    )}
                </Card>
            </PageSection>
        </>
    );
};

export { ResultsPageTestingFarm };

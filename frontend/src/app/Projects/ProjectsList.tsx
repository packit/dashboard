import React, { useMemo } from "react";
import {
    Button,
    Tooltip,
    TooltipPosition,
    Flex,
    FlexItem,
    Card,
    CardTitle,
    Gallery,
    GalleryItem,
    CardBody,
    CardFooter,
    CardHeader,
} from "@patternfly/react-core";

import {
    CodeBranchIcon,
    SecurityIcon,
    BuildIcon,
    BlueprintIcon,
    ExternalLinkAltIcon,
} from "@patternfly/react-icons";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Project {
    namespace: string;
    repo_name: string;
    project_url: string;
    prs_handled: number;
    branches_handled: number;
    releases_handled: number;
    issues_handled: number;
}

function getProjectInfoURL(project: Project) {
    const urlArray = project.project_url?.split("/");
    const forge = urlArray[2];
    return `/projects/${forge}/${project.namespace}/${project.repo_name}`;
}

interface ProjectsListProps {
    forge?: string;
    namespace?: string;
    project_url?: string;
    repo_name?: string;
}

// TODO: Move data fetching to parent components
const ProjectsList: React.FC<ProjectsListProps> = (props) => {
    // Fetch data from dashboard backend (or if we want, directly from the API)
    const fetchData = ({ pageParam = 1 }): Promise<Project> =>
        fetch(
            `${import.meta.env.VITE_API_URL}/projects?page=${pageParam}`,
        ).then((response) => response.json());

    const { isInitialLoading, isError, fetchNextPage, data } = useInfiniteQuery(
        ["ProjectsList"],
        fetchData,
        {
            getNextPageParam: (_, allPages) => allPages.length + 1,
            keepPreviousData: true,
        },
    );

    const flatPages = useMemo(() => data?.pages.flat() ?? [], [data?.pages]);

    let loadButton = (
        <center>
            <br />
            <Button variant="control" onClick={() => fetchNextPage()}>
                Load More
            </Button>
        </center>
    );

    // // Hide the Load More Button if we're displaying projects of one namespace only
    // if (props.forge && props.namespace) {
    //     loadButton = "";
    // }

    // If backend API is down
    if (isError) {
        return <ErrorConnection />;
    }

    // Show preloader if waiting for API data
    if (isInitialLoading) {
        return <Preloader />;
    }

    return (
        <>
            <Gallery hasGutter>
                {flatPages.map((project, index) => (
                    <GalleryItem key={index}>
                        <Card isFullHeight>
                            <CardHeader>
                                <CardTitle>
                                    <Link to={getProjectInfoURL(project)}>
                                        {`${project.namespace}/${project.repo_name}`}
                                    </Link>
                                    <br />
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="External link to project"
                                    >
                                        <ExternalLinkAltIcon />
                                    </a>
                                </CardTitle>
                            </CardHeader>
                            <CardBody></CardBody>
                            <CardFooter>
                                <Flex>
                                    <FlexItem>
                                        <Tooltip
                                            position={TooltipPosition.top}
                                            content={"Branches Handled"}
                                            aria="labelledby"
                                        >
                                            <CodeBranchIcon />
                                        </Tooltip>
                                        {project.branches_handled}
                                    </FlexItem>
                                    <FlexItem>
                                        <Tooltip
                                            position={TooltipPosition.top}
                                            content={"Issues Handled"}
                                            aria="labelledby"
                                        >
                                            <SecurityIcon />
                                        </Tooltip>
                                        {project.issues_handled}
                                    </FlexItem>
                                    <FlexItem>
                                        <Tooltip
                                            position={TooltipPosition.top}
                                            content={"Releases Handled"}
                                            aria="labelledby"
                                        >
                                            <BuildIcon />
                                        </Tooltip>
                                        {project.releases_handled}
                                    </FlexItem>
                                    <FlexItem>
                                        <Tooltip
                                            position={TooltipPosition.top}
                                            content={"Pull Requests Handled"}
                                            aria="labelledby"
                                        >
                                            <BlueprintIcon />
                                        </Tooltip>
                                        {project.prs_handled}
                                    </FlexItem>
                                </Flex>
                            </CardFooter>
                        </Card>
                    </GalleryItem>
                ))}
            </Gallery>
            {loadButton}
        </>
    );
};

export { ProjectsList };

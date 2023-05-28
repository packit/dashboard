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
import {
    TableComposable,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@patternfly/react-table";

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

const columnNames = {
    name: "Repositories",
    branches: "Branches",
    prs: "Pull requests",
    workspaces: "Workspaces",
    lastCommit: "Last commit",
};

type ColumnKey = keyof typeof columnNames;

// TODO: Move data fetching to parent components
const ProjectsList: React.FC<ProjectsListProps> = (props) => {
    const [expandedCells, setExpandedCells] =
        React.useState<Record<string, ColumnKey>>();
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
            <TableComposable aria-label="Projects">
                <Thead>
                    <Tr>
                        <Th>Repositories</Th>
                        <Th>Branches Handled</Th>
                        <Th>Issues Handled</Th>
                        <Th>Releases Handled</Th>
                        <Th>Pull Requests Handled</Th>
                        <Th />
                    </Tr>
                </Thead>
                {flatPages.map((project, index) => {
                    const expandedCellKey = expandedCells
                        ? expandedCells[project.repo_name]
                        : null;
                    const isRowExpanded = !!expandedCellKey;
                    return (
                        <Tbody
                            key={project.repo_name}
                            isExpanded={isRowExpanded}
                        >
                            <Tr>
                                <Td
                                    width={25}
                                    dataLabel={columnNames.name}
                                    component="th"
                                >
                                    <Link to={getProjectInfoURL(project)}>
                                        {`${project.namespace}/${project.repo_name}`}
                                    </Link>
                                </Td>
                                <Td
                                    width={10}
                                    dataLabel={columnNames.branches}
                                    // compoundExpand={compoundExpandParams(repo, 'branches', rowIndex, 1)}
                                >
                                    <CodeBranchIcon key="icon" />{" "}
                                    {project.branches_handled}
                                </Td>
                                <Td
                                    width={10}
                                    dataLabel={columnNames.branches}
                                    // compoundExpand={compoundExpandParams(repo, 'branches', rowIndex, 1)}
                                >
                                    <SecurityIcon key="icon" />{" "}
                                    {project.issues_handled}
                                </Td>
                                <Td
                                    width={10}
                                    dataLabel={columnNames.branches}
                                    // compoundExpand={compoundExpandParams(repo, 'branches', rowIndex, 1)}
                                >
                                    <BuildIcon key="icon" />{" "}
                                    {project.releases_handled}
                                </Td>
                                <Td
                                    width={15}
                                    dataLabel={columnNames.branches}
                                    // compoundExpand={compoundExpandParams(repo, 'branches', rowIndex, 1)}
                                >
                                    <BlueprintIcon key="icon" />{" "}
                                    {project.prs_handled}
                                </Td>
                                <Td dataLabel={columnNames.branches}>
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="External link to project"
                                    >
                                        Open external link
                                    </a>
                                </Td>
                            </Tr>
                        </Tbody>
                    );
                })}
            </TableComposable>
            <center>
                <br />
                <Button variant="control" onClick={() => fetchNextPage()}>
                    Load More
                </Button>
            </center>
        </>
    );
};

export { ProjectsList };

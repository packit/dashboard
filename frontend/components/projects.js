import React, { useState, useEffect } from "react";
import {
    PageSection,
    PageSectionVariants,
    Button,
    Tooltip,
    TooltipPosition,
    Flex,
    FlexItem,
    TextContent,
    Card,
    CardTitle,
    Gallery,
    GalleryItem,
    CardBody,
    Text,
} from "@patternfly/react-core";

import {
    CodeBranchIcon,
    SecurityIcon,
    BuildIcon,
    BlueprintIcon,
    ExternalLinkAltIcon,
} from "@patternfly/react-icons";

import ConnectionError from "./error";
import Preloader from "./preloader";
import { Link } from "react-router-dom";

const Projects = () => {
    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Projects</Text>
                    <Text component="p">
                        List of repos with Packit Service enabled
                    </Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <ProjectsList />
            </PageSection>
        </div>
    );
};

export { Projects };

const ProjectsList = () => {
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [projects, setProjects] = useState([]);

    // Fetch data from dashboard backend (or if we want, directly from the API)
    function fetchData() {
        // console.log(`Route is /api/copr-builds/?page=${page}&per_page=20`);
        fetch(`https://stg.packit.dev/api/projects?page=${page}&per_page=50`)
            .then((response) => response.json())
            .then((data) => {
                setProjects(projects.concat(data));
                setLoaded(true);
                setPage(page + 1); // set next page
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    function goToProjectInfo(project) {
        const urlArray = project.project_url.split("/");
        const forge = urlArray[2];
        return `/projects/${forge}/${project.namespace}/${project.repo_name}`;
    }

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
            <Gallery hasGutter>
                {projects.map((project, index) => (
                    <GalleryItem key={index}>
                        {/* onClick={} */}
                        <Card isHoverable>
                            <CardTitle>
                                <a href={project.project_url}>
                                    {`${project.namespace}/${project.repo_name}`}
                                </a>
                                <br />
                                <Link to={() => goToProjectInfo(project)}>
                                    <ExternalLinkAltIcon />
                                </Link>
                            </CardTitle>
                            <CardBody>
                                <Flex>
                                    <FlexItem>
                                        <Tooltip
                                            position={TooltipPosition.top}
                                            content={"Branches Handled"}
                                        >
                                            <CodeBranchIcon />
                                        </Tooltip>
                                        {project.branches_handled}
                                    </FlexItem>
                                    <FlexItem>
                                        <Tooltip
                                            position={TooltipPosition.top}
                                            content={"Issues Handled"}
                                        >
                                            <SecurityIcon />
                                        </Tooltip>
                                        {project.issues_handled}
                                    </FlexItem>
                                    <FlexItem>
                                        <Tooltip
                                            position={TooltipPosition.top}
                                            content={"Releases Handled"}
                                        >
                                            <BuildIcon />
                                        </Tooltip>
                                        {project.releases_handled}
                                    </FlexItem>
                                    <FlexItem>
                                        <Tooltip
                                            position={TooltipPosition.top}
                                            content={"Pull Requests Handled"}
                                        >
                                            <BlueprintIcon />
                                        </Tooltip>
                                        {project.prs_handled}
                                    </FlexItem>
                                </Flex>
                            </CardBody>
                        </Card>
                    </GalleryItem>
                ))}
            </Gallery>
            <center>
                <br />
                <Button variant="control" onClick={fetchData}>
                    Load More
                </Button>
            </center>
        </div>
    );
};

import React, { useState, useEffect } from "react";
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

const ProjectsList = (props) => {
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [projects, setProjects] = useState([]);
    // by default, ignore projects without any handled item
    const [showUseful, setShowUseful] = useState(true);

    // If a namespace and forge are provided, then load those
    // otherwise load all projects
    let jsonLink = `${apiURL}/projects?page=${page}&per_page=50`;
    if (props.forge && props.namespace) {
        jsonLink = `${apiURL}/projects/${props.forge}/${props.namespace}`;
    }

    // Fetch data from dashboard backend (or if we want, directly from the API)
    function fetchData() {
        fetch(jsonLink)
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

    let loadButton = (
        <center>
            <br />
            <Button variant="control" onClick={fetchData}>
                Load More
            </Button>
        </center>
    );

    // we may not want to view projects which have packit-service enabled but
    // are not actually using it
    function checkUseful(project, index) {
        if (
            project.prs_handled > 0 ||
            project.branches_handled > 0 ||
            project.releases_handled > 0 ||
            project.issues_handled > 0 ||
            !showUseful
        ) {
            return (
                <GalleryItem key={index}>
                    <Card isHoverable>
                        <CardTitle>
                            <Link to={() => goToProjectInfo(project)}>
                                {`${project.namespace}/${project.repo_name}`}
                            </Link>
                            <br />
                            <a href={project.project_url} target="_blank">
                                <ExternalLinkAltIcon />
                            </a>
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
            );
        } else {
            return <></>;
        }
    }

    // Hide the  Load More Button if we're displaying projects of one namespace only
    if (props.forge && props.namespace) {
        loadButton = "";
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
                    <>{checkUseful(project, index)}</>
                ))}
            </Gallery>
            {loadButton}
        </div>
    );
};

export default ProjectsList;

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
    // by default, ignore non useful projects ie without any handled item
    const showUseful = true;

    // If a namespace and forge are provided, then load those
    // otherwise load all projects
    let jsonLink = `${process.env.REACT_APP_API_URL}/projects?page=${page}&per_page=50`;
    if (props.forge && props.namespace) {
        jsonLink = `${process.env.REACT_APP_API_URL}/projects/${props.forge}/${props.namespace}`;
    } else if (props.forge) {
        jsonLink = `${process.env.REACT_APP_API_URL}/projects/${props.forge}?page=${page}&per_page=50`;
    }

    function fetchData() {
        let usefulProjects = [];
        fetch(jsonLink)
            .then((response) => response.json())
            .then((data) => {
                for (const index in data) {
                    const project = data[index];
                    if (
                        project.prs_handled > 0 ||
                        project.branches_handled > 0 ||
                        project.releases_handled > 0 ||
                        project.issues_handled > 0 ||
                        !showUseful
                    ) {
                        usefulProjects.push(project);
                    }
                }
                setLoaded(true);
                console.log("Useful: ", usefulProjects.length);
                setProjects(projects.concat(usefulProjects));
                if (
                    usefulProjects.length < 6 && // fetch more if 5 or less useful projects
                    !(props.forge && props.namespace) && // no pagination when namespace is specified
                    data.length > 0
                ) {
                    console.log("Less useful projects, load more");
                    setPage(page + 1);
                }
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }

    // The useEffect Hook gets executed after every state change i.e. every render with
    // the condition that any element in the array (2nd parameter) is also changed
    // the elements of this dependency array can be state, props, etc
    // if no dependency array is passed as parameter then it executes after every render
    // if empty array is passed, then it executes only after initial render
    // here useEffect gets executed after page changes and it fetched more pages
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    function loadMore() {
        setPage(page + 1);
    }

    function goToProjectInfo(project) {
        const urlArray = project.project_url.split("/");
        const forge = urlArray[2];
        return `/projects/${forge}/${project.namespace}/${project.repo_name}`;
    }

    let loadButton = (
        <center>
            <br />
            <Button variant="control" onClick={loadMore}>
                Load More
            </Button>
        </center>
    );

    // Hide the Load More Button if we're displaying projects of one namespace only
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
                    <GalleryItem key={index}>
                        <Card isHoverable>
                            <CardTitle>
                                <Link to={() => goToProjectInfo(project)}>
                                    {`${project.namespace}/${project.repo_name}`}
                                </Link>
                                <br />
                                <a
                                    href={project.project_url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
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
                ))}
            </Gallery>
            {loadButton}
        </div>
    );
};

export default ProjectsList;

import React, { useState, useEffect } from "react";
import {
    PageSection,
    PageSectionVariants,
    Button,
    Alert,
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
    Bullseye,
    Text,
    Form,
    Grid,
    GridItem,
    FormGroup,
    TextInput,
} from "@patternfly/react-core";

import {
    CodeBranchIcon,
    SecurityIcon,
    BuildIcon,
    BlueprintIcon,
    ExternalLinkAltIcon,
    SearchIcon,
} from "@patternfly/react-icons";

import ConnectionError from "./error";
import Preloader from "./preloader";
import { Link, useHistory } from "react-router-dom";

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
                <SearchProject />
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

const SearchProject = () => {
    const [namespace, setNamespace] = useState("");
    const [repoName, setRepoName] = useState("");
    const [forge, setForge] = useState("");
    const [showWarning, setWarning] = useState(false);

    // Name refers to HTML 5 History API
    // We use this to go to a dynamic link (/projects/<whatever the user entered>/../.. )
    const history = useHistory();

    function goToProjectDetails() {
        if (namespace && repoName && forge) {
            history.push(`/projects/${forge}/${namespace}/${repoName}`);
        } else {
            console.log("pokemoster");
            setWarning(true);
        }
    }

    let emptyFormWarning;
    if (showWarning) {
        emptyFormWarning = (
            <Alert variant="danger" title="Input fields should not be empty" />
        );
    }

    return (
        <Card>
            <CardBody>
                <Form>
                    <FormGroup>
                        <Grid sm={6} md={4} lg={3} xl2={3}>
                            <GridItem>
                                <TextInput
                                    isRequired
                                    type="text"
                                    name="forge"
                                    aria-describedby="forge"
                                    id="project-search-forge"
                                    value={forge}
                                    placeholder="github.com"
                                    onChange={(e) => setForge(e)}
                                />
                            </GridItem>
                            <GridItem>
                                <TextInput
                                    isRequired
                                    type="text"
                                    name="namespace"
                                    aria-describedby="namespace"
                                    id="project-search-namespace"
                                    value={namespace}
                                    placeholder="the-namespace"
                                    onChange={(e) => setNamespace(e)}
                                />
                            </GridItem>
                            <GridItem>
                                <TextInput
                                    isRequired
                                    type="text"
                                    name="repo-name"
                                    aria-describedby="repo-name"
                                    id="project-search-repo-name"
                                    value={repoName}
                                    placeholder="the-repo-name"
                                    onChange={(e) => setRepoName(e)}
                                />
                            </GridItem>

                            <GridItem>
                                <Bullseye>
                                    <SearchIcon onClick={goToProjectDetails} />
                                </Bullseye>
                            </GridItem>
                        </Grid>
                    </FormGroup>
                    {emptyFormWarning}
                </Form>
            </CardBody>
        </Card>
    );
};

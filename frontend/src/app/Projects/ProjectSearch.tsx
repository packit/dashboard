import React, { useState } from "react";
import {
    Alert,
    Card,
    CardBody,
    Bullseye,
    Form,
    Grid,
    GridItem,
    Button,
    TextInput,
    Panel,
    InputGroup,
    PanelMain,
    PanelMainBody,
} from "@patternfly/react-core";

import { SearchIcon } from "@patternfly/react-icons";

import { useNavigate } from "react-router-dom";

const ProjectSearch = () => {
    const [namespace, setNamespace] = useState("");
    const [repoName, setRepoName] = useState("");
    const [forge, setForge] = useState("");
    const [showWarning, setWarning] = useState(false);

    // Name refers to HTML 5 History API
    // We use this to go to a dynamic link (/projects/<whatever the user entered>/../.. )
    const navigate = useNavigate();

    function goToProjectDetails() {
        if (forge && namespace && repoName) {
            navigate(`/projects/${forge}/${namespace}/${repoName}`);
        } else if (forge && namespace) {
            navigate(`/projects/${forge}/${namespace}`);
        } else if (forge && !namespace && !repoName) {
            navigate(`/projects/${forge}`);
        } else {
            setWarning(true);
        }
    }

    let invalidFormWarning;
    if (showWarning) {
        invalidFormWarning = <Alert variant="danger" title="Invalid input" />;
    }

    return (
        <Panel>
            <PanelMain>
                <PanelMainBody>
                    <Form>
                        <InputGroup>
                            <TextInput
                                isRequired
                                type="text"
                                name="forge"
                                aria-describedby="forge"
                                id="project-search-forge"
                                value={forge}
                                placeholder="forge (e.g. github.com, required)"
                                onChange={(e) => setForge(e)}
                            />
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
                            <Button
                                variant="plain"
                                aria-label="Search"
                                onClick={goToProjectDetails}
                            >
                                <SearchIcon />
                            </Button>
                        </InputGroup>
                        {invalidFormWarning}
                    </Form>
                </PanelMainBody>
            </PanelMain>
        </Panel>
    );
};

export { ProjectSearch };

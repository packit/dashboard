import React, { useState } from "react";
import {
    Alert,
    Card,
    CardBody,
    Bullseye,
    Form,
    Grid,
    GridItem,
    FormGroup,
    TextInput,
} from "@patternfly/react-core";

import { SearchIcon } from "@patternfly/react-icons";

import { useHistory } from "react-router-dom";

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

export default SearchProject;

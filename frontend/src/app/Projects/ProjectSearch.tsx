// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { useState } from "react";
import {
  Alert,
  Form,
  Button,
  TextInput,
  Panel,
  InputGroup,
  PanelMain,
  PanelMainBody,
  InputGroupItem,
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

  function handleForgeChange(url: string) {
    // Remove protocol if any
    url = url.replace("http://", "").replace("https://", "");

    // Split to forge - namespace - repo_name and update states
    const parts = url.split("/");
    setForge(parts[0]);
    switch (parts.length) {
      case 1:
        break;
      case 2:
        setNamespace(parts[1]);
        break;
      case 3:
        setNamespace(parts[1]);
        setRepoName(parts[2]);
        break;
      default:
        // GitLab namespace can contain slash
        setNamespace(`${parts[1]}/${parts[2]}`);
        setRepoName(parts[3]);
        break;
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
              <InputGroupItem isFill>
                <TextInput
                  isRequired
                  type="text"
                  name="forge"
                  aria-describedby="forge"
                  id="project-search-forge"
                  value={forge}
                  placeholder="Git forge (e.g. github.com) or paste repo URL (e.g. github.com/packit/packit)"
                  onChange={(_event, val) => handleForgeChange(val)}
                />
              </InputGroupItem>
              <InputGroupItem isFill>
                <TextInput
                  isRequired
                  type="text"
                  name="namespace"
                  aria-describedby="namespace"
                  id="project-search-namespace"
                  value={namespace}
                  placeholder="Git repo namespace (optional)"
                  onChange={(_event, val) => setNamespace(val)}
                />
              </InputGroupItem>
              <InputGroupItem isFill>
                <TextInput
                  isRequired
                  type="text"
                  name="repo-name"
                  aria-describedby="repo-name"
                  id="project-search-repo-name"
                  value={repoName}
                  placeholder="Git repo name (optional)"
                  onChange={(_event, val) => setRepoName(val)}
                />
              </InputGroupItem>
              <InputGroupItem>
                <Button
                  variant="plain"
                  aria-label="Search"
                  onClick={goToProjectDetails}
                >
                  <SearchIcon />
                </Button>
              </InputGroupItem>
            </InputGroup>
            {invalidFormWarning}
          </Form>
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
};

export { ProjectSearch };

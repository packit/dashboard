import React, { useState, useEffect } from "react";

import ConnectionError from "./error";
import Preloader from "./preloader";

import {
    Button,
    DataList,
    DataListToggle,
    DataListCell,
    DataListItem,
    DataListContent,
    DataListItemCells,
    DataListItemRow,
    Dropdown,
    DropdownToggle,
    DropdownItem,
    Label,
} from "@patternfly/react-core";

import { CaretDownIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";

const PullRequestList = (props) => {
    // Local State
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState({});
    const [prList, setPRList] = useState([]);

    // PR Info
    const forge = props.forge;
    const namespace = props.namespace;
    const repoName = props.repoName;

    // Fetch data from dashboard backend (or if we want, directly from the API)
    function fetchData() {
        fetch(
            `/api/projects/${forge}/${namespace}/${repoName}/prs?page=${page}&per_page=10`
        )
            .then((response) => response.json())
            .then((data) => {
                setPRList(prList.concat(data));
                setLoaded(true);
                setPage(page + 1); // set next page
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }

    // Executes fetchData on first render of component
    // look at detailed comment in ./copr_builds_table.js
    useEffect(() => {
        fetchData();
    }, []);

    function onToggle(prID) {
        // We cant just invert the previous state here
        // because its undefined for the first time
        if (expanded[prID]) {
            let copyExpanded = { ...expanded };
            copyExpanded[prID] = false;
            setExpanded(copyExpanded);
        } else {
            // expanded[prID] = true;
            let copyExpanded = { ...expanded };
            copyExpanded[prID] = true;
            setExpanded(copyExpanded);
        }
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
            <DataList aria-label="PR List" isCompact>
                {prList.map((pr, index) => (
                    <DataListItem
                        aria-labelledby="PR List Item"
                        key={index}
                        isExpanded={expanded[pr.pr_id]}
                    >
                        <DataListItemRow>
                            <DataListToggle
                                onClick={() => onToggle(pr.pr_id)}
                                isExpanded={expanded[pr.pr_id]}
                                id={`pull-request-${pr.pr_id}`}
                                aria-controls="ex-expand1"
                            />
                            <DataListItemCells
                                dataListCells={[
                                    <DataListCell key="data-list-title-pr">
                                        <div>#{pr.pr_id}</div>
                                    </DataListCell>,
                                ]}
                            />
                        </DataListItemRow>
                        <DataListContent
                            aria-label="PR Content"
                            id="ex-expand1"
                            isHidden={!expanded[pr.pr_id]}
                        >
                            <PRInfo pr={pr} />
                        </DataListContent>
                    </DataListItem>
                ))}
            </DataList>
            <center>
                <br />
                <Button variant="control" onClick={fetchData}>
                    Load More
                </Button>
            </center>
        </div>
    );
};

const PRInfo = (props) => {
    const [isOpen, setOpen] = useState(false);
    const [activeView, setActiveView] = useState("Builds");

    // Open/close the dropdown
    // This is called in two cases
    // a) when the toggle button is pressed
    // b) when someone chooses an entry
    function onToggle() {
        setOpen((isOpen) => !isOpen);
    }

    // NOTE: Since we did not need any advanced table features,
    // I used a regular html table instead of Patternfly React's table component
    let activeViewContent;
    if (activeView == "Builds") {
        activeViewContent = (
            <div>
                <table
                    className="pf-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="Builds Table"
                >
                    <thead>
                        <tr role="row">
                            <th role="columnheader" scope="col">
                                Build ID
                            </th>
                            <th role="columnheader" scope="col">
                                Chroot
                            </th>
                            <th role="columnheader" scope="col">
                                Status
                            </th>
                            <th role="columnheader" scope="col">
                                Web URL
                            </th>
                        </tr>
                    </thead>
                    <tbody role="rowgroup">
                        {props.pr.builds.map((build, index) => (
                            <tr role="row" key={index}>
                                <td role="cell" data-label="Build ID">
                                    {build.build_id}
                                </td>
                                <td role="cell" data-label="Chroot">
                                    <Label color="blue">{build.chroot}</Label>
                                </td>
                                <td role="cell" data-label="Status">
                                    {build.status}
                                </td>
                                <td role="cell" data-label="Web URL">
                                    <WebUrlIcon link={build.web_url} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    if (activeView == "Test Runs") {
        activeViewContent = (
            <div>
                <table
                    className="pf-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="Testing Farm Results Table"
                >
                    <thead>
                        <tr role="row">
                            <th role="columnheader" scope="col">
                                Pipeline ID
                            </th>
                            <th role="columnheader" scope="col">
                                Chroot
                            </th>
                            <th role="columnheader" scope="col">
                                Status
                            </th>
                            <th role="columnheader" scope="col">
                                Web URL
                            </th>
                        </tr>
                    </thead>
                    <tbody role="rowgroup">
                        {props.pr.tests.map((test, index) => (
                            <tr role="row">
                                <td role="cell" data-label="Pipeline ID">
                                    {test.pipeline_id}
                                </td>
                                <td role="cell" data-label="Chroot">
                                    <Label color="blue">{test.chroot}</Label>
                                </td>
                                <td role="cell" data-label="Status">
                                    {test.status}
                                </td>
                                <td role="cell" data-label="Web URL">
                                    <WebUrlIcon link={test.web_url} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div>
            <Dropdown
                onSelect={onToggle}
                toggle={
                    <DropdownToggle
                        onToggle={onToggle}
                        toggleIndicator={CaretDownIcon}
                    >
                        {activeView}
                    </DropdownToggle>
                }
                isOpen={isOpen}
                dropdownItems={[
                    <DropdownItem
                        key="builds"
                        onClick={() => setActiveView("Builds")}
                    >
                        Builds
                    </DropdownItem>,
                    <DropdownItem
                        key="tests"
                        onClick={() => setActiveView("Test Runs")}
                    >
                        Test Runs
                    </DropdownItem>,
                ]}
            />
            <br />
            <br />

            {activeViewContent}
        </div>
    );
};

const WebUrlIcon = (props) => {
    const handleClick = () => window.open(props.link, "_blank");
    return <ExternalLinkAltIcon onClick={handleClick} />;
};

export default PullRequestList;

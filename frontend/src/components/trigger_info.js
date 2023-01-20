import React, { useState } from "react";

import {
    Dropdown,
    DropdownToggle,
    DropdownItem,
    Label,
} from "@patternfly/react-core";

import { CaretDownIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";

// Trigger here refers to one unique pull request or one unique branch push
const TriggerInfo = (props) => {
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
    if (activeView === "Builds") {
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
                    <tbody>
                        {props.trigger.builds.map((build, index) => (
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
    if (activeView === "SRPM Builds") {
        activeViewContent = (
            <div>
                <table
                    className="pf-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="SRPM Builds Table"
                >
                    <thead>
                        <tr role="row">
                            <th role="columnheader" scope="col">
                                SRPM Build ID
                            </th>
                            <th role="columnheader" scope="col">
                                Success
                            </th>
                            <th role="columnheader" scope="col">
                                Logs
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.trigger.srpm_builds.map((build, index) => (
                            <tr role="row" key={index}>
                                <td role="cell" data-label="SRPM Build ID">
                                    {build.srpm_build_id}
                                </td>
                                <td role="cell" data-label="Status">
                                    {build.status}
                                </td>
                                <td role="cell" data-label="Logs">
                                    <WebUrlIcon link={build.log_url} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    if (activeView === "Test Runs") {
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
                    <tbody>
                        {props.trigger.tests.map((test, index) => (
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
                        key="builds"
                        onClick={() => setActiveView("SRPM Builds")}
                    >
                        SRPM Builds
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

export default TriggerInfo;

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useState } from "react";

import { Label } from "@patternfly/react-core";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from "@patternfly/react-core/deprecated";

import { CaretDownIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

interface TriggerInfoProps {
  trigger: {
    builds: {
      build_id: string;
      chroot: string;
      status: string;
      web_url: string;
    }[];
    koji_builds: {
      build_id: string;
      status: string;
      chroot: string;
      web_url: string;
    }[];
    srpm_builds: {
      srpm_build_id: number;
      status: string;
      log_url: string;
    }[];
    tests: {
      pipeline_id: string;
      chroot: string;
      status: string;
      web_url: string;
    }[];
  };
}

// Trigger here refers to one unique pull request or one unique branch push
const TriggerInfo: React.FC<TriggerInfoProps> = (props) => {
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
      <Table variant="compact" aria-label="Builds Table">
        <Thead>
          <Tr>
            <Th>Build ID</Th>
            <Th>Chroot</Th>
            <Th>Success</Th>
            <Th>Web URL</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.trigger.builds.map((build, index) => (
            <Tr role="row" key={index}>
              <Td data-label="Build ID">{build.build_id}</Td>
              <Td data-label="Chroot">
                <Label color="blue">{build.chroot}</Label>
              </Td>
              <Td data-label="Status">{build.status}</Td>
              <Td data-label="Web URL">
                <WebUrlIcon link={build.web_url} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }
  if (activeView === "SRPM Builds") {
    activeViewContent = (
      <Table variant="compact" aria-label="SRPM Builds Table">
        <Thead>
          <Tr>
            <Th>SRPM Build ID</Th>
            <Th>Success</Th>
            <Th>Logs</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.trigger.srpm_builds.map((build, index) => (
            <Tr key={index}>
              <Td data-label="SRPM Build ID">{build.srpm_build_id}</Td>
              <Td data-label="Status">{build.status}</Td>
              <Td data-label="Logs">
                <WebUrlIcon link={build.log_url} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }
  if (activeView === "Test Runs") {
    activeViewContent = (
      <Table variant="compact" aria-label="Testing Farm Results Table">
        <Thead>
          <Tr>
            <Th>Pipeline ID</Th>
            <Th>Chroot</Th>
            <Th>Status</Th>
            <Th>Web URL</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.trigger.tests.map((test) => (
            <Tr key={test.pipeline_id}>
              <Td data-label="Pipeline ID">{test.pipeline_id}</Td>
              <Td data-label="Chroot">
                <Label color="blue">{test.chroot}</Label>
              </Td>
              <Td data-label="Status">{test.status}</Td>
              <Td data-label="Web URL">
                <WebUrlIcon link={test.web_url} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  }

  return (
    <>
      <Dropdown
        onSelect={onToggle}
        toggle={
          <DropdownToggle onToggle={onToggle} toggleIndicator={CaretDownIcon}>
            {activeView}
          </DropdownToggle>
        }
        isOpen={isOpen}
        dropdownItems={[
          <DropdownItem key="builds" onClick={() => setActiveView("Builds")}>
            Builds
          </DropdownItem>,
          <DropdownItem
            key="builds"
            onClick={() => setActiveView("SRPM Builds")}
          >
            SRPM Builds
          </DropdownItem>,
          <DropdownItem key="tests" onClick={() => setActiveView("Test Runs")}>
            Test Runs
          </DropdownItem>,
        ]}
      />
      <br />
      <br />

      {activeViewContent}
    </>
  );
};

interface WebUrlIconProps {
  link: string;
}

const WebUrlIcon: React.FC<WebUrlIconProps> = (props) => {
  return (
    <a href={props.link} rel="noreferrer" target="_blank">
      <ExternalLinkAltIcon />
    </a>
  );
};

export { TriggerInfo };

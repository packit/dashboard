// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useState } from "react";
import {
  PageSection,
  Card,
  CardBody,
  PageSectionVariants,
  TextContent,
  Text,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Checkbox,
  Button,
  ToolbarGroup,
  Tooltip,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink, TriggerSuffix } from "../Trigger/TriggerLink";
import { SyncReleaseTargetStatusLabel } from "../StatusLabel/SyncReleaseTargetStatusLabel";
import { LogViewer, LogViewerSearch } from "@patternfly/react-log-viewer";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { useQuery } from "@tanstack/react-query";
import { DownloadIcon, ExpandIcon } from "@patternfly/react-icons";
import { ResultProgressStep, AcceptedStatuses } from "./ResultProgressStep";

interface ResultsPageSyncReleaseRunsProps {
  job: "propose-downstream" | "pull-from-upstream";
}

interface SyncReleaseRun {
  status: string;
  branch: string;
  downstream_pr_url: string;
  submitted_time: number;
  start_time: number;
  finished_time: number;
  logs: string;
  repo_namespace: string;
  repo_name: string;
  git_repo: string;
  pr_id: number | null;
  issue_id: number | null;
  branch_name: string | null;
  release: string | null;
  downstream_pr_project: string | null;
}

const fetchSyncRelease = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok && response.status !== 404) {
      throw Promise.reject(response);
    }
    return response.json();
  });

const ResultsPageSyncReleaseRuns: React.FC<ResultsPageSyncReleaseRunsProps> = ({
  job,
}) => {
  const displayText =
    job === "pull-from-upstream"
      ? "Pull from upstream results"
      : "Propose downstream results";
  useTitle(displayText);
  const { id } = useParams();

  const [isTextWrapped, setIsTextWrapped] = useState(true);
  const [isLineNumbersShown, setIsLineNumbersShown] = useState(false);
  // TODO(spytec): Not sure what the ref type is supposed to be
  const logViewerRef = React.useRef<{ scrollToBottom: () => void }>(null);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const API_URL = `${import.meta.env.VITE_API_URL}/${job}/${id}`;
  const { data, isError, isInitialLoading } = useQuery<
    SyncReleaseRun | { error: string }
  >([API_URL], () => fetchSyncRelease(API_URL));

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  // Show preloader if waiting for API data
  if (isInitialLoading || data === undefined) {
    return <Preloader />;
  }

  if ("error" in data) {
    return (
      <PageSection>
        <Card>
          <CardBody>
            <Title headingLevel="h1" size="lg">
              Not Found.
            </Title>
          </CardBody>
        </Card>
      </PageSection>
    );
  }

  // const linkToDownstreamPR = data.downstream_pr_url ? (
  //   <a href={data.downstream_pr_url} rel="noreferrer" target="_blank">
  //     Click here
  //   </a>
  // ) : (
  //   <>Link will be available after successful downstream PR submission.</>
  // );

  const getLinkToPackage = () => {
    if (!data.downstream_pr_project) return <>Link not available.</>;

    const lastSlashIndex = data.downstream_pr_project.lastIndexOf("/");
    const packageName =
      lastSlashIndex !== -1
        ? data.downstream_pr_project.substring(lastSlashIndex + 1)
        : "";
    return packageName ? (
      <a href={data.downstream_pr_project} rel="noreferrer" target="_blank">
        {packageName}
      </a>
    ) : (
      <>Link not available.</>
    );
  };

  const FooterButton = () => {
    const handleClick = () => {
      if (logViewerRef.current) logViewerRef.current.scrollToBottom();
    };
    return <Button onClick={handleClick}>Jump to the bottom</Button>;
  };

  const onDownloadClick = () => {
    if (!data.logs) return;
    const element = document.createElement("a");
    const file = new Blob([data.logs], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${data.repo_namespace}-${data.repo_name}-${data.start_time}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const onExpandClick = (_: never) => {
    const element: Element | null = document.querySelector("#logviewer");
    if (!isFullScreen && element) {
      void element.requestFullscreen();
      setIsFullScreen(true);
    } else {
      void document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // TODO(SpyTec): Move to its own component
  const logs = (
    <PageSection>
      <Card>
        <CardBody>
          <LogViewer
            id="logviewer"
            ref={logViewerRef}
            isTextWrapped={isTextWrapped}
            hasLineNumbers={isLineNumbersShown}
            theme="dark"
            height={isFullScreen ? "100%" : 600}
            data={data.logs ? data.logs : "Log is not available yet."}
            toolbar={
              <Toolbar>
                <ToolbarContent>
                  <ToolbarGroup>
                    <ToolbarItem>
                      <LogViewerSearch
                        placeholder="Search value"
                        minSearchChars={3}
                      />
                    </ToolbarItem>
                    <ToolbarItem>
                      <Checkbox
                        label="Wrap text"
                        aria-label="wrap text checkbox"
                        isChecked={isTextWrapped}
                        id="wrap-text-checkbox"
                        onChange={(_event, val) => setIsTextWrapped(val)}
                      />
                    </ToolbarItem>
                    <ToolbarItem>
                      <Checkbox
                        label="Show line numbers"
                        aria-label="show line numbers checkbox"
                        isChecked={isLineNumbersShown}
                        id="show-lines-checkbox"
                        onChange={(_event, val) => setIsLineNumbersShown(val)}
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup
                    variant="icon-button-group"
                    align={{ default: "alignRight" }}
                  >
                    <ToolbarItem>
                      <Tooltip position="top" content={<div>Download</div>}>
                        <Button
                          onClick={onDownloadClick}
                          variant="plain"
                          aria-label="Download current logs"
                        >
                          <DownloadIcon />
                        </Button>
                      </Tooltip>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Tooltip position="top" content={<div>Expand</div>}>
                        <Button
                          onClick={onExpandClick}
                          variant="plain"
                          aria-label="View log viewer in full screen"
                        >
                          <ExpandIcon />
                        </Button>
                      </Tooltip>
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarContent>
              </Toolbar>
            }
            footer={<FooterButton />}
          />
        </CardBody>
      </Card>
    </PageSection>
  );

  /**
   * Map the different statuses of sync release runs to the visual aspect
   *
   * TODO (@Venefilyn): change the statuses to match API
   *
   * @param {string} status - list of statuses from sync release
   * @return {*}  {AcceptedStatuses}
   */
  function getSyncReleaseStatus(status: string): AcceptedStatuses {
    switch (status) {
      case "error":
        return "fail";
      case "successful":
        return "success";
      case "skipped":
        return "skipped";
      default:
        return "unknown";
    }
  }

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{displayText}</Text>
          <Text component="p">
            <strong>
              <TriggerLink trigger={data}>
                <TriggerSuffix trigger={data} />
              </TriggerLink>
            </strong>
            <br />
          </Text>
        </TextContent>
      </PageSection>

      <PageSection>
        <Card>
          <CardBody>
            <DescriptionList
              columnModifier={{
                default: "1Col",
                sm: "2Col",
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Sync status</DescriptionListTerm>
                <DescriptionListDescription>
                  <SyncReleaseTargetStatusLabel
                    status={data.status}
                    target={data.branch}
                    link={data.downstream_pr_url}
                  />
                </DescriptionListDescription>
                <DescriptionListTerm>Package</DescriptionListTerm>
                <DescriptionListDescription>
                  {getLinkToPackage()}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  <span className="pf-v5-u-screen-reader">
                    {displayText} timeline
                  </span>
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <ResultProgressStep
                    noun="Run"
                    submittedTime={data.submitted_time}
                    startTime={data.start_time}
                    finishedTime={data.finished_time}
                    status={getSyncReleaseStatus(data.status)}
                  />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </PageSection>
      {logs}
    </>
  );
};

export { ResultsPageSyncReleaseRuns };

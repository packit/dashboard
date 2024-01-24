import React from "react";
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
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Divider,
} from "@patternfly/react-core";
import { LogViewer, LogViewerSearch } from "@patternfly/react-log-viewer";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { useQuery } from "@tanstack/react-query";

interface SRPMBuild {
  status: string;
  build_start_time: number;
  build_finished_time: number;
  build_submitted_time: number;
  url: string;
  logs: string | null;
  logs_url: string;
  copr_build_id: string;
  copr_web_url: string;
  run_ids: number[];
  repo_namespace: string;
  repo_name: string;
  git_repo: string;
  pr_id: number | null;
  issue_id: number | null;
  branch_name: string | null;
  release: string | null;
}

const fetchSRPMBuild = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok && response.status !== 404) {
      throw Promise.reject(response);
    }
    return response.json();
  });

const ResultsPageSRPM = () => {
  useTitle("SRPM Results");
  let { id } = useParams();

  const URL = `${import.meta.env.VITE_API_URL}/srpm-builds/${id}`;
  const { data, isError, isInitialLoading } = useQuery<
    SRPMBuild | { error: string }
  >([URL], () => fetchSRPMBuild(URL));

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

  const srpmURL = data.url ? (
    <a href={data.url}>Link to download</a>
  ) : (
    "Not available to download"
  );

  const submittedAt = data.build_submitted_time ? (
    <Timestamp stamp={data.build_submitted_time} verbose={true} />
  ) : (
    "Not available"
  );

  const startedAt = data.build_start_time ? (
    <Timestamp stamp={data.build_start_time} verbose={true} />
  ) : (
    "Not available"
  );

  const finishedAt = data.build_finished_time ? (
    <Timestamp stamp={data.build_finished_time} verbose={true} />
  ) : (
    "Not available"
  );

  const logs = data.copr_build_id ? (
    ""
  ) : (
    <PageSection>
      <Card>
        <CardBody>
          <LogViewer
            data={data.logs ? data.logs : "Log is not available"}
            toolbar={
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <LogViewerSearch
                      placeholder="Search value"
                      minSearchChars={3}
                    />
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            }
            hasLineNumbers={false}
          />
        </CardBody>
      </Card>
    </PageSection>
  );

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">SRPM Build</Text>

          <Text component="p">
            <strong>
              <TriggerLink builds={data} />
            </strong>
          </Text>
        </TextContent>
      </PageSection>
      <Divider></Divider>
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
                <DescriptionListTerm>Copr build</DescriptionListTerm>
                <DescriptionListDescription>
                  <StatusLabel status={data.status} link={data.copr_web_url} />{" "}
                  {data.url ? (
                    <>
                      {" "}
                      (
                      <a
                        href={
                          data.logs_url
                            ? data.logs_url
                            : `${URL}/builder-live.log`
                        }
                        rel="noreferrer"
                        target={"_blank"}
                      >
                        Logs
                      </a>
                      ) (
                      <a href={data.url} rel="noreferrer" target={"_blank"}>
                        Results
                      </a>
                      )
                    </>
                  ) : (
                    <></>
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Build Submitted Time</DescriptionListTerm>
                <DescriptionListDescription>
                  {submittedAt}
                </DescriptionListDescription>
                <DescriptionListTerm>Build Start Time</DescriptionListTerm>
                <DescriptionListDescription>
                  {startedAt}
                </DescriptionListDescription>
                <DescriptionListTerm>Build Finish Time</DescriptionListTerm>
                <DescriptionListDescription>
                  {finishedAt}
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

export { ResultsPageSRPM };

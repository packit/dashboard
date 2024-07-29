// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

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

import { ErrorConnection } from "../../components/errors/ErrorConnection";
import { Preloader } from "../../components/Preloader";
import {
  TriggerLink,
  TriggerSuffix,
} from "../../components/trigger/TriggerLink";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { useQuery } from "@tanstack/react-query";
import { AcceptedStatuses, ResultProgressStep } from "./ResultProgressStep";

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
  const { id } = useParams();

  const URL = `${import.meta.env.VITE_API_URL}/srpm-builds/${id}`;
  const { data, isError, isInitialLoading } = useQuery<
    SRPMBuild | { error: string }
  >([URL], () => fetchSRPMBuild(URL));

  /**
   * Map the different statuses of SRPM builds to the visual aspect
   *
   * TODO (@Venefilyn): change the statuses to match API
   *
   * @param {string} status - list of statuses from SRPM builds
   * @return {*}  {AcceptedStatuses}
   */
  function getSRPMStatus(status: string): AcceptedStatuses {
    switch (status) {
      case "error":
      case "failure":
        return "fail";
      case "success":
        return "success";
      default:
        return "unknown";
    }
  }

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
              <TriggerLink trigger={data}>
                <TriggerSuffix trigger={data} />
              </TriggerLink>
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
                        href={data.logs_url}
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
                <DescriptionListTerm>
                  <span className="pf-v5-u-screen-reader">
                    SRPM build timeline
                  </span>
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <ResultProgressStep
                    submittedTime={data.build_submitted_time}
                    startTime={data.build_start_time}
                    finishedTime={data.build_finished_time}
                    status={getSRPMStatus(data.status)}
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

export { ResultsPageSRPM };

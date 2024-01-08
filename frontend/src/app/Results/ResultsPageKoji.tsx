import React from "react";
import {
  PageSection,
  Card,
  CardBody,
  PageSectionVariants,
  TextContent,
  Text,
  Title,
  Label,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { TableHeader, TableBody } from "@patternfly/react-table/deprecated";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { getCommitLink } from "../utils/forgeUrls";
import { useQuery } from "@tanstack/react-query";
import { SHACopy } from "../utils/SHACopy";

interface KojiBuild {
  scratch: boolean;
  task_id: string;
  status: string;
  chroot: string;
  build_start_time: number;
  build_finished_time: number;
  build_submitted_time: number;
  commit_sha: string;
  web_url: string;
  build_logs_urls: string;
  srpm_build_id: number;
  run_ids: number[];
  repo_namespace: string;
  repo_name: string;
  git_repo: string;
  pr_id: number | null;
  issue_id: number | null;
  branch_name: string | null;
  release: string | null;
}

const fetchKojiBuilds = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok && response.status !== 404) {
      throw Promise.reject(response);
    }
    return response.json();
  });

const ResultsPageKoji = () => {
  useTitle("Koji Results");
  let { id } = useParams();

  const URL = `${import.meta.env.VITE_API_URL}/koji-builds/${id}`;
  const { data, isError, isInitialLoading } = useQuery<
    KojiBuild | { error: string }
  >([URL], () => fetchKojiBuilds(URL));

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

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Koji Build Results</Text>
          <Text component="p">
            <strong>
              <TriggerLink builds={data} />
              <SHACopy git_repo={data.git_repo} commit_sha={data.commit_sha} />
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
                {data.srpm_build_id ? (
                  <>
                    <DescriptionListTerm>SRPM Build</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label
                        href={`/results/srpm-builds/${data.srpm_build_id}`}
                      >
                        Details
                      </Label>
                    </DescriptionListDescription>
                  </>
                ) : null}
                <DescriptionListTerm>Koji Build</DescriptionListTerm>
                <DescriptionListDescription>
                  <StatusLabel
                    target={data.chroot}
                    status={data.status}
                    link={data.web_url}
                  />{" "}
                  ({data.scratch ? "scratch" : "production"})
                </DescriptionListDescription>
                <DescriptionListTerm>Build logs</DescriptionListTerm>
                <DescriptionListDescription>
                  {data.build_logs_urls !== null &&
                  Object.keys(data.build_logs_urls).length !== 0 ? (
                    <Table variant="compact">
                      <Tbody>
                        {data.build_logs_urls
                          ? Object.entries(data.build_logs_urls).map(
                              ([arch, url]) => (
                                <Tr key={arch}>
                                  <Td role="cell" data-label="Build log">
                                    <a href={url}>{arch}</a>
                                  </Td>
                                </Tr>
                              ),
                            )
                          : null}
                      </Tbody>
                    </Table>
                  ) : (
                    <span>not provided</span>
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Build Submitted Time</DescriptionListTerm>
                <DescriptionListDescription>
                  <Timestamp stamp={data.build_submitted_time} verbose={true} />
                </DescriptionListDescription>
                <DescriptionListTerm>Build Start Time</DescriptionListTerm>
                <DescriptionListDescription>
                  <Timestamp stamp={data.build_start_time} verbose={true} />
                </DescriptionListDescription>
                <DescriptionListTerm>Build Finish Time</DescriptionListTerm>
                <DescriptionListDescription>
                  <Timestamp stamp={data.build_finished_time} verbose={true} />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { ResultsPageKoji };

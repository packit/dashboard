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
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink, TriggerSuffix } from "../Trigger/TriggerLink";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { useQuery } from "@tanstack/react-query";
import { SHACopy } from "../utils/SHACopy";

interface BodhiUpdate {
  packit_id: number;
  status: string;
  alias: string | null;
  web_url: string | null;
  koji_nvrs: string;
  branch: string;
  submitted_time: number;
  update_creation_time: number | null;
  pr_id: number | null;
  branch_name: string | null;
  release: string | null;
  project_url: string;
  repo_namespace: string;
  repo_name: string;
}

const fetchBodhiUpdates = (url: string) =>
  fetch(url).then((response) => {
    if (!response.ok && response.status !== 404) {
      throw Promise.reject(response);
    }
    return response.json();
  });

const ResultsPageBodhiUpdate = () => {
  useTitle("Bodhi Updates");
  const { id } = useParams();

  const URL = `${import.meta.env.VITE_API_URL}/bodhi-updates/${id}`;
  const { data, isError, isInitialLoading } = useQuery<
    BodhiUpdate | { error: string }
  >([URL], () => fetchBodhiUpdates(URL));

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
          <Text component="h1">Bodhi Update Results</Text>
          <Text component="p">
            <strong>
              <TriggerLink trigger={data}>
                <TriggerSuffix trigger={data} />
              </TriggerLink>
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
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>
                  <StatusLabel
                    target={data.branch}
                    status={data.status}
                    link={data.web_url}
                  />{" "}
                </DescriptionListDescription>
                <DescriptionListTerm>Alias</DescriptionListTerm>
                <DescriptionListDescription>
                  {" "}
                  {data.alias !== null ? data.alias : <span>not provided</span>}
                </DescriptionListDescription>
                <DescriptionListTerm>Koji NVRs</DescriptionListTerm>
                <DescriptionListDescription>
                  {" "}
                  {data.koji_nvrs}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  Update Processing Time
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <Timestamp stamp={data.submitted_time} verbose={true} />
                </DescriptionListDescription>
                <DescriptionListTerm>Update Creation Time</DescriptionListTerm>
                <DescriptionListDescription>
                  <Timestamp stamp={data.update_creation_time} verbose={true} />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export { ResultsPageBodhiUpdate };

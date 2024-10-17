// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Card,
  CardBody,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { bodhiUpdateQueryOptions } from "../../queries/bodhi/bodhiUpdateQuery";
import { Route as BodhiRoute } from "../../routes/jobs_/bodhi.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../shared/Preloader";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

export const BodhiUpdate = () => {
  const { id } = BodhiRoute.useParams();

  const { data, isError, isLoading } = useQuery(
    bodhiUpdateQueryOptions({ id }),
  );

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  // Show preloader if waiting for API data
  if (isLoading || data === undefined) {
    return <Preloader />;
  }

  if ("error" in data) {
    return (
      <PageSection hasBodyWrapper={false}>
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
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Bodhi Update Results</Content>
          <Content component="p">
            <strong>
              <TriggerLink trigger={data}>
                <TriggerSuffix trigger={data} />
              </TriggerLink>
              {/* <SHACopy project_url={data.project_url} commit_sha={data.commit_sha} /> */}
            </strong>
            <br />
          </Content>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
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
                    link={data.web_url || undefined}
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

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
  Label,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { Table, Tbody, Td, Tr } from "@patternfly/react-table";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { kojiTagRequestQueryOptions } from "../../queries/koji/kojiTagRequestQuery";
import { Route as KojiRoute } from "../../routes/jobs_/koji-tag-request.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { LabelLink } from "../shared/LabelLink";
import { Preloader } from "../shared/Preloader";
import { SHACopy } from "../shared/SHACopy";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

export const KojiTagRequest = () => {
  const { id } = KojiRoute.useParams();
  const { data, isLoading, isError } = useQuery(
    kojiTagRequestQueryOptions({ id }),
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
          <Content component="h1">Koji Tagging Request Results</Content>
          <strong>
            <TriggerLink trigger={data}>
              <TriggerSuffix trigger={data} />
            </TriggerLink>
            <SHACopy
              project_url={data.project_url}
              commit_sha={data.commit_sha}
            />
          </strong>
          <br />
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
                <DescriptionListTerm>Koji Tagging Request</DescriptionListTerm>
                <DescriptionListDescription>
                  <StatusLabel
                    target={data.chroot}
                    status="unknown"
                    link={data.web_url}
                  />
                </DescriptionListDescription>
                <DescriptionListTerm>Sidetag</DescriptionListTerm>
                <DescriptionListDescription>
                  <strong>
                    <a
                      href={`https://koji.fedoraproject.org/koji/search?match=exact&type=tag&terms=${data.sidetag}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.sidetag}
                    </a>
                  </strong>
                </DescriptionListDescription>
                <DescriptionListTerm>NVR</DescriptionListTerm>
                <DescriptionListDescription>
                  <strong>
                    <a
                      href={`https://koji.fedoraproject.org/koji/search?match=exact&type=build&terms=${data.nvr}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.nvr}
                    </a>
                  </strong>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>
                  Koji tagging request submitted
                </DescriptionListTerm>
                <DescriptionListDescription>
                  {<Timestamp stamp={data.tag_request_submitted_time} />}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

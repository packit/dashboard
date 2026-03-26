// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Card,
  CardBody,
  CodeBlock,
  CodeBlockCode,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  Title,
} from "@patternfly/react-core";

import { useQuery } from "@tanstack/react-query";
import { logDetectiveResultQueryOptions } from "../../queries/logdetective/logDetectiveResultQuery";
import { Route as LogDetectiveRoute } from "../../routes/jobs_/log-detective.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../shared/Preloader";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";

export const LogDetectiveResult = () => {
  const { id } = LogDetectiveRoute.useParams();

  const { data, isError, isLoading } = useQuery(
    logDetectiveResultQueryOptions({ id }),
  );

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  if (data && "error" in data) {
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
          <Content component="h1">Log Detective Results</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <Card>
          {!data ? (
            isLoading || data === undefined ? (
              <Preloader />
            ) : (
              <PageSection hasBodyWrapper={false}>
                <Card>
                  <CardBody>
                    <Title headingLevel="h1" size="lg">
                      Not Found.
                    </Title>
                  </CardBody>
                </Card>
              </PageSection>
            )
          ) : (
            <>
              <CardBody>
                <DescriptionList
                  columnModifier={{
                    default: "1Col",
                    sm: "2Col",
                  }}
                >
                  <DescriptionListGroup>
                    <DescriptionListTerm>Packit ID</DescriptionListTerm>
                    <DescriptionListDescription>
                      {data.packit_id}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Analysis ID</DescriptionListTerm>
                    <DescriptionListDescription>
                      {data.analysis_id}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Status</DescriptionListTerm>
                    <DescriptionListDescription>
                      <StatusLabel status={data.status} />
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Submitted Time</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Timestamp stamp={data.submitted_time} verbose={true} />
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
              {data.log_detective_response?.explanation ? (
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Explanation</DescriptionListTerm>
                      <DescriptionListDescription>
                        <CodeBlock>
                          <CodeBlockCode>
                            {data.log_detective_response.explanation.text}
                          </CodeBlockCode>
                        </CodeBlock>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              ) : null}
            </>
          )}
        </Card>
      </PageSection>
    </>
  );
};

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
  List,
  ListItem,
  PageSection,
  Title,
} from "@patternfly/react-core";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { logDetectiveGroupQueryOptions } from "../../queries/logdetective/logDetectiveGroupQuery";
import { Route as LogDetectiveGroupRoute } from "../../routes/jobs_/log-detective.group.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../shared/Preloader";
import { Timestamp } from "../shared/Timestamp";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

export const LogDetectiveGroup = () => {
  const { id } = LogDetectiveGroupRoute.useParams();

  const { data, isError, isLoading } = useQuery(
    logDetectiveGroupQueryOptions({ id }),
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
          <Content component="h1">Log Detective Group</Content>
          <strong>
            {data ? (
              <TriggerLink trigger={data}>
                <TriggerSuffix trigger={data} />
              </TriggerLink>
            ) : (
              <></>
            )}
          </strong>
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
            <CardBody>
              <DescriptionList
                columnModifier={{
                  default: "1Col",
                  sm: "2Col",
                }}
              >
                <DescriptionListGroup>
                  <DescriptionListTerm>Submitted Time</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Timestamp stamp={data.submitted_time} verbose={true} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>
                    Log Detective Targets
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <List isPlain>
                      {data.log_detective_target_ids.map((targetId) => (
                        <ListItem key={targetId}>
                          <Link to={`/jobs/log-detective/${targetId}`}>
                            #{targetId}
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Run IDs</DescriptionListTerm>
                  <DescriptionListDescription>
                    {data.run_ids.join(", ")}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </CardBody>
          )}
        </Card>
      </PageSection>
    </>
  );
};

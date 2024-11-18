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
import { oshScanQueryOptions } from "../../queries/osh/oshScanQuery";
import { Route as OSHScanRoute } from "../../routes/jobs_/openscanhub.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { LabelLink } from "../shared/LabelLink";
import { Preloader } from "../shared/Preloader";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

export const OSHScan = () => {
  const { id } = OSHScanRoute.useParams();

  const { data, isError, isLoading } = useQuery(oshScanQueryOptions({ id }));

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
          <Content component="h1">OpenScanHub Scan Results</Content>
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
                    status={data.status}
                    target={"rawhide"}
                    link={data.url}
                  />
                </DescriptionListDescription>

                {data.status === "succeeded" ? (
                  <>
                    <DescriptionListTerm>New findings</DescriptionListTerm>
                    <DescriptionListDescription>
                      {data.issues_added_count ?? "N/A"}
                    </DescriptionListDescription>
                    <DescriptionListTerm>Result files</DescriptionListTerm>
                    <DescriptionListDescription>
                      <List>
                        <ListItem>
                          <a
                            href={data.issues_added_url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Added issues
                          </a>
                        </ListItem>
                        <ListItem>
                          <a
                            href={data.issues_fixed_url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Fixed issues
                          </a>
                        </ListItem>
                        <ListItem>
                          <a
                            href={data.scan_results_url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            All results
                          </a>
                        </ListItem>
                      </List>
                    </DescriptionListDescription>
                  </>
                ) : (
                  <></>
                )}
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Scan Submitted Time</DescriptionListTerm>
                <DescriptionListDescription>
                  <Timestamp stamp={data.submitted_time} verbose={true} />
                </DescriptionListDescription>
                <DescriptionListTerm>Copr Build</DescriptionListTerm>
                <DescriptionListDescription>
                  <LabelLink
                    to={`/jobs/copr-builds/${data.copr_build_target_id}`}
                  >
                    Details
                  </LabelLink>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Card,
  CardBody,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { Table, Tbody, Td, Tr } from "@patternfly/react-table";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { kojiBuildQueryOptions } from "../../queries/koji/kojiBuildQuery";
import { Route as KojiRoute } from "../../routes/jobs_/koji.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../shared/Preloader";
import {
  AcceptedStatuses,
  ResultProgressStep,
} from "../shared/ResultProgressStep";
import { SHACopy } from "../shared/SHACopy";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

export const KojiBuild = () => {
  const { id } = KojiRoute.useParams();
  const { data, isLoading, isError } = useQuery(kojiBuildQueryOptions({ id }));

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
                        render={({ className }) => (
                          <Link
                            to={`/jobs/srpm/${data.srpm_build_id}`}
                            className={className}
                          >
                            Details
                          </Link>
                        )}
                      ></Label>
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
                <DescriptionListTerm>
                  <span className="pf-v5-u-screen-reader">
                    Koji build timeline
                  </span>
                </DescriptionListTerm>
                <DescriptionListDescription>
                  <ResultProgressStep
                    submittedTime={data.build_submitted_time}
                    startTime={data.build_start_time}
                    finishedTime={data.build_finished_time}
                    status={getKojiBuildStatus(data.status)}
                  />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

/**
 * Map the different statuses of Koji builds to the visual aspect
 *
 * TODO (@Venefilyn): change the statuses to match API
 *
 * @param {string} status - list of statuses from Koji builds
 * @return {*}  {AcceptedStatuses}
 */
function getKojiBuildStatus(status: string): AcceptedStatuses {
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

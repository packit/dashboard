// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  LabelGroup,
  PageSection,
  PageSectionVariants,
  Skeleton,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";
import { Timestamp } from "../shared/Timestamp";
import { pipelineQueryOptions } from "../../queries/pipeline/pipelineQuery";
import { Route as PipelineRoute } from "../../routes/pipeline_.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { SyncReleaseTargetStatusLabel } from "../statusLabels/SyncReleaseTargetStatusLabel";

interface StatusItem {
  packit_id: number;
  status?: string;
  target: string;
}

interface StatusItemSRPM {
  packit_id: number;
  status: string;
  target?: string;
}

interface StatusesProps {
  route: string;
  entries: (StatusItem | StatusItemSRPM)[];
  statusClass: typeof StatusLabel;
}

const Statuses: React.FC<StatusesProps> = (props) => {
  const labels = useMemo(() => {
    const labelled: React.ReactNode[] = [];
    props.entries.forEach((entry, i) => {
      labelled.push(
        <props.statusClass
          key={i}
          status={entry.status ?? entry.target!}
          target={entry.target}
          link={`/jobs/${props.route}/${entry.packit_id}`}
        />,
      );
    });
    return labelled;
  }, [props]);

  // Technically LabelGroup doesn't accept elements, only string. But the way it currently uses them works for us
  // Should be tested as part of a visual test
  return <LabelGroup>{labels}</LabelGroup>;
};

export const Pipeline = () => {
  const { id } = PipelineRoute.useParams();

  const { isError, data, isLoading } = useQuery(pipelineQueryOptions({ id }));

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Pipeline results</Text>
          <Text component="p">
            <strong>
              {data && "repo_namespace" in data.trigger ? (
                <TriggerLink trigger={data.trigger}>
                  <TriggerSuffix trigger={data.trigger} />
                </TriggerLink>
              ) : (
                <Skeleton width="230px" />
              )}
            </strong>
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
                <DescriptionListTerm>SRPM Build</DescriptionListTerm>
                <DescriptionListDescription>
                  {data?.srpm ? (
                    <Statuses
                      route={"srpm"}
                      statusClass={StatusLabel}
                      entries={[data.srpm]}
                    />
                  ) : isLoading ? (
                    <Skeleton width="150px" />
                  ) : (
                    <Text component={TextVariants.small}>
                      <i>Not available</i>
                    </Text>
                  )}
                </DescriptionListDescription>
                <DescriptionListTerm>Copr builds</DescriptionListTerm>
                <DescriptionListDescription>
                  {data?.copr.length ? (
                    <Statuses
                      route={"copr"}
                      statusClass={StatusLabel}
                      entries={data.copr}
                    />
                  ) : isLoading ? (
                    <Skeleton width="150px" />
                  ) : (
                    <Text component={TextVariants.small}>
                      <i>Not available</i>
                    </Text>
                  )}
                </DescriptionListDescription>
                <DescriptionListTerm>Testing Farm runs</DescriptionListTerm>
                <DescriptionListDescription>
                  {data?.test_run.length ? (
                    <Statuses
                      route={"testing-farm"}
                      statusClass={StatusLabel}
                      entries={data.test_run}
                    />
                  ) : isLoading ? (
                    <Skeleton width="150px" />
                  ) : (
                    <Text component={TextVariants.small}>
                      <i>Not available</i>
                    </Text>
                  )}
                </DescriptionListDescription>
                <DescriptionListTerm>Propose Downstreams</DescriptionListTerm>
                <DescriptionListDescription>
                  {data?.propose_downstream.length ? (
                    <Statuses
                      route={"propose-downstream"}
                      statusClass={SyncReleaseTargetStatusLabel}
                      entries={data.propose_downstream}
                    />
                  ) : isLoading ? (
                    <Skeleton width="150px" />
                  ) : (
                    <Text component={TextVariants.small}>
                      <i>Not available</i>
                    </Text>
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Submitted time</DescriptionListTerm>
                <DescriptionListDescription>
                  {data?.time_submitted ? (
                    <Text component={TextVariants.small}>
                      <Timestamp stamp={data.time_submitted} />
                    </Text>
                  ) : isLoading ? (
                    <Skeleton width="150px" />
                  ) : (
                    <Text component={TextVariants.small}>
                      <i>Not available</i>
                    </Text>
                  )}
                </DescriptionListDescription>
                <DescriptionListTerm>Pull From Upstreams</DescriptionListTerm>
                <DescriptionListDescription>
                  {data?.pull_from_upstream.length ? (
                    <Statuses
                      route={"pull-from-upstream"}
                      statusClass={SyncReleaseTargetStatusLabel}
                      entries={data.pull_from_upstream}
                    />
                  ) : isLoading ? (
                    <Skeleton width="150px" />
                  ) : (
                    <Text component={TextVariants.small}>
                      <i>Not available</i>
                    </Text>
                  )}
                </DescriptionListDescription>
                <DescriptionListTerm>Koji builds</DescriptionListTerm>
                <DescriptionListDescription>
                  {data?.koji.length ? (
                    <Statuses
                      route={"koji"}
                      statusClass={StatusLabel}
                      entries={data.koji}
                    />
                  ) : isLoading ? (
                    <Skeleton width="150px" />
                  ) : (
                    <Text component={TextVariants.small}>
                      <i>Not available</i>
                    </Text>
                  )}
                </DescriptionListDescription>
                <DescriptionListTerm>Bodhi updates</DescriptionListTerm>
                <DescriptionListDescription>
                  {data?.bodhi_update.length ? (
                    <Statuses
                      route={"bodhi"}
                      statusClass={StatusLabel}
                      entries={data.bodhi_update}
                    />
                  ) : isLoading ? (
                    <Skeleton width="150px" />
                  ) : (
                    <Text component={TextVariants.small}>
                      <i>Not available</i>
                    </Text>
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

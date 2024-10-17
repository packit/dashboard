// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  LabelGroup,
  PageSection,
  Skeleton,
} from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { pipelineQueryOptions } from "../../queries/pipeline/pipelineQuery";
import { Route as PipelineRoute } from "../../routes/pipeline_.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { SyncReleaseTargetStatusLabel } from "../statusLabels/SyncReleaseTargetStatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

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
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Pipeline results</Content>
          <Content component="p">
            <strong>
              {data && "repo_namespace" in data.trigger ? (
                <TriggerLink trigger={data.trigger}>
                  <TriggerSuffix trigger={data.trigger} />
                </TriggerLink>
              ) : (
                <Skeleton width="230px" />
              )}
            </strong>
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
                    <Content component={ContentVariants.small}>
                      <i>Not available</i>
                    </Content>
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
                    <Content component={ContentVariants.small}>
                      <i>Not available</i>
                    </Content>
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
                    <Content component={ContentVariants.small}>
                      <i>Not available</i>
                    </Content>
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
                    <Content component={ContentVariants.small}>
                      <i>Not available</i>
                    </Content>
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Submitted time</DescriptionListTerm>
                <DescriptionListDescription>
                  {data?.time_submitted ? (
                    <Content component={ContentVariants.small}>
                      <Timestamp stamp={data.time_submitted} />
                    </Content>
                  ) : isLoading ? (
                    <Skeleton width="150px" />
                  ) : (
                    <Content component={ContentVariants.small}>
                      <i>Not available</i>
                    </Content>
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
                    <Content component={ContentVariants.small}>
                      <i>Not available</i>
                    </Content>
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
                    <Content component={ContentVariants.small}>
                      <i>Not available</i>
                    </Content>
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
                    <Content component={ContentVariants.small}>
                      <i>Not available</i>
                    </Content>
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

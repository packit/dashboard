// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Card,
  CardBody,
  ClipboardCopy,
  Content,
  DataList,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  Title,
} from "@patternfly/react-core";
import React, { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { testingFarmRunQueryOptions } from "../../queries/testingFarm/testingFarmRunQuery";
import { Route as TestingFarmRoute } from "../../routes/jobs_/testing-farm.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../shared/Preloader";
import { SHACopy } from "../shared/SHACopy";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";
import { CoprDataListItem } from "./CoprDataListItem";
import { KojiDataListItem } from "./KojiDataListItem";

export const TestingFarmRun = () => {
  const { id } = TestingFarmRoute.useParams();

  const { data, isError, isLoading } = useQuery(
    testingFarmRunQueryOptions({ id }),
  );
  const [coprBuildIds, setCoprBuildIds] = useState<number[]>([]);
  const [kojiBuildIds, setKojiBuildIds] = useState<number[]>([]);

  useEffect(() => {
    if (data && "copr_build_ids" in data) {
      setCoprBuildIds(data?.copr_build_ids.filter((copr) => copr !== null));
    }
    if (data && "koji_build_ids" in data) {
      setKojiBuildIds(data?.koji_build_ids.filter((koji) => koji !== null));
    }
  }, [data]);

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  if (data && "error" in data) {
    return;
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Testing Farm Results</Content>
          <strong>
            {data ? (
              <>
                <TriggerLink trigger={data}>
                  <TriggerSuffix trigger={data} />
                </TriggerLink>
                <SHACopy
                  project_url={data.project_url}
                  commit_sha={data.commit_sha}
                />
              </>
            ) : (
              <></>
            )}
          </strong>
          <br />
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
                    <DescriptionListTerm>Status</DescriptionListTerm>
                    <DescriptionListDescription>
                      <StatusLabel
                        status={data.status}
                        target={data.chroot}
                        link={data.web_url}
                      />
                    </DescriptionListDescription>
                    <DescriptionListTerm>Pipeline ID</DescriptionListTerm>
                    <DescriptionListDescription>
                      <ClipboardCopy
                        isReadOnly
                        hoverTip="Copy"
                        clickTip="Copied"
                        variant="inline-compact"
                      >
                        {data.pipeline_id}
                      </ClipboardCopy>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>
                      Run Submitted Time
                    </DescriptionListTerm>
                    <DescriptionListDescription>
                      <Timestamp stamp={data.submitted_time} verbose={true} />
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </CardBody>
              {coprBuildIds.length > 0 && (
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Copr Build(s)</DescriptionListTerm>
                      <DescriptionListDescription>
                        <DataList aria-label="Copr builds">
                          {coprBuildIds.map((coprId) => (
                            <CoprDataListItem id={coprId} key={coprId} />
                          ))}
                        </DataList>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              )}
              {kojiBuildIds.length > 0 && (
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Koji build(s)</DescriptionListTerm>
                      <DescriptionListDescription>
                        <DataList aria-label="Koji builds">
                          {kojiBuildIds.map((kojiId) => (
                            <KojiDataListItem id={kojiId} key={kojiId} />
                          ))}
                        </DataList>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              )}
            </>
          )}
        </Card>
      </PageSection>
    </>
  );
};

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Card,
  CardBody,
  ClipboardCopy,
  DataList,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
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

export const TestingFarmRun = () => {
  const { id } = TestingFarmRoute.useParams();

  const { data, isError, isLoading } = useQuery(
    testingFarmRunQueryOptions({ id }),
  );
  const [coprBuildIds, setCoprBuildIds] = useState<number[]>([]);

  useEffect(() => {
    if (data && "copr_build_ids" in data) {
      setCoprBuildIds(data?.copr_build_ids.filter((copr) => copr !== null));
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
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Testing Farm Results</Text>
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
        </TextContent>
      </PageSection>
      <PageSection>
        <Card>
          {!data ? (
            isLoading || data === undefined ? (
              <Preloader />
            ) : (
              <PageSection>
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
            </>
          )}
        </Card>
      </PageSection>
    </>
  );
};

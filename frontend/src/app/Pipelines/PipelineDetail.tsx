// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { useMemo } from "react";

import {
  Card,
  CardBody,
  CardHeader,
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
import { TriggerLink, TriggerSuffix } from "../Trigger/TriggerLink";
import { Preloader } from "../Preloader/Preloader";
import { SyncReleaseTargetStatusLabel } from "../StatusLabel/SyncReleaseTargetStatusLabel";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useTitle } from "../utils/useTitle";

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

interface DescriptionListStatusProps {
  route: string;
  name: string | React.ReactNode;
  entries: (StatusItem | StatusItemSRPM)[];
  statusClass: typeof StatusLabel;
}

const DescriptionListStatus: React.FC<DescriptionListStatusProps> = (props) => {
  const labels = useMemo(() => {
    const labelled: React.ReactNode[] = [];
    props.entries.forEach((entry, i) => {
      labelled.push(
        <props.statusClass
          key={i}
          status={entry.status ?? entry.target!}
          target={entry.target}
          link={`/results/${props.route}/${entry.packit_id}`}
        />,
      );
    });
    return labelled;
  }, [props]);

  // Filter out empty statuses
  if (!labels.length) {
    return <></>;
  }

  return (
    <>
      <DescriptionListGroup>
        <DescriptionListTerm>{props.name}</DescriptionListTerm>
        <DescriptionListDescription>{labels}</DescriptionListDescription>
      </DescriptionListGroup>
    </>
  );
};

interface PipelineItem {
  packit_id: number;
  target: string;
  status: string;
}

interface PipelineRun {
  merged_run_id: number;
  srpm: {
    packit_id: number;
    status: string;
  };
  copr: PipelineItem[];
  koji: PipelineItem[];
  test_run: PipelineItem[];
  propose_downstream: PipelineItem[];
  pull_from_upstream: PipelineItem[];
  time_submitted: number;
  trigger?: {
    repo_namespace: string;
    repo_name: string;
    git_repo: string;
    pr_id: number | null;
    issue_id: number | null;
    branch_name: string | null;
    release: string | null;
  };
}

export const PipelineDetail = () => {
  let { id } = useParams();
  useTitle(`Pipeline Details ${id}`);

  // TODO (spytec): Once routes are implemented we can use this
  // const location = useLocation();
  // const matches = useMatches();
  // const currentMatch = matches.find(
  //   (match) => match.pathname === location.pathname
  // );

  const fetchData = () =>
    fetch(`${import.meta.env.VITE_API_URL}/runs/merged/${id}`).then(
      (response) => response.json(),
    );

  const { isInitialLoading, isError, data, isFetching } = useQuery<PipelineRun>(
    ["pipeline", id],
    fetchData,
  );

  // TODO (spytec): Once routes are implemented we can use this
  // if we're not inside a specific route, default to copr-builds and redirect
  // const navigate = useNavigate();
  // useEffect(() => {
  //   console.log(matches);
  //   if (matches[matches.length - 1].id === "pipeline-id") {
  //     navigate("copr-builds");
  //   }
  // }, [navigate]);

  // Show preloader if waiting for API data
  if (isInitialLoading || data === undefined) {
    return <Preloader />;
  }

  // TODO: Redirect to /copr-builds, same as jobs.tsx
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Pipeline details</Text>
          {data.trigger && (
            <>
              <Text component="p">
                <strong>
                  <TriggerLink trigger={data.trigger}>
                    <TriggerSuffix trigger={data.trigger} />
                  </TriggerLink>
                </strong>{" "}
                -{" "}
                <i>
                  <Timestamp stamp={data.time_submitted} />
                </i>
              </Text>
            </>
          )}
        </TextContent>
      </PageSection>
      <PageSection>
        <Card>
          <CardHeader>
            <Title headingLevel="h2">Statuses</Title>
          </CardHeader>
          <CardBody>
            <DescriptionList isHorizontal>
              <DescriptionListStatus
                name={"SRPM"}
                route={"srpm-builds"}
                statusClass={StatusLabel}
                entries={data.srpm ? [data.srpm] : []}
              />
              <DescriptionListStatus
                name={"Copr"}
                route={"copr-builds"}
                statusClass={StatusLabel}
                entries={data.copr}
              />
              <DescriptionListStatus
                name={"Koji"}
                route={"koji-builds"}
                statusClass={StatusLabel}
                entries={data.koji}
              />
              <DescriptionListStatus
                name={"Testing Farm"}
                route={"testing-farm"}
                statusClass={StatusLabel}
                entries={data.test_run}
              />
              <DescriptionListStatus
                name={"Propose Downstream"}
                route={"propose-downstream"}
                statusClass={SyncReleaseTargetStatusLabel}
                entries={data.propose_downstream}
              />
              <DescriptionListStatus
                name={"Pull From Upstream"}
                route={"pull-from-upstream"}
                statusClass={SyncReleaseTargetStatusLabel}
                entries={data.pull_from_upstream}
              />
            </DescriptionList>
          </CardBody>
        </Card>
      </PageSection>
      {/* TODO: Place contents from nav here once routes are implemented */}
      {/* <PageSection>
        <Outlet />
      </PageSection> */}
    </>
  );
};

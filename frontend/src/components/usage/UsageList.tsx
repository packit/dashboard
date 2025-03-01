// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
	ChartBullet,
	ChartDonut
} from '@patternfly/react-charts/victory';
import {
  Card,
  CardBody,
  CardTitle,
  Flex,
  FlexItem,
  PageSection,
  Title,
} from "@patternfly/react-core";
import React from "react";

import { useQuery } from "@tanstack/react-query";
import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../shared/Preloader";
import { UsageListData } from "./UsageListData";

const fetchDataByGranularity = (granularity: UsageListProps["what"]) =>
  fetch(`${import.meta.env.VITE_API_URL}/usage/${granularity}`).then(
    (response) => {
      if (!response.ok) {
        throw Promise.reject(response);
      }
      return response.json();
    },
  );

interface UsageListProps {
  what: "past-day" | "past-week" | "past-month" | "past-year" | "total";
}

const UsageList: React.FC<UsageListProps> = (props) => {
  const { data, isLoading, isError } = useQuery<UsageListData>({
    queryKey: ["usage", props.what],
    queryFn: () => fetchDataByGranularity(props.what),
  });

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  // Show preloader if waiting for API data
  if (isLoading) {
    return <Preloader />;
  }

  if (!data || "error" in data) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <Title headingLevel="h1" size="lg">
              {!data ? "Data is loading, wait a few minutes." : "Not Found."}
            </Title>
          </CardBody>
        </Card>
      </PageSection>
    );
  }

  type ChartData = [
    top_projects_data: { x: string; y: number }[],
    top_projects_legend: { name: string }[],
  ];
  function getChartData(
    top_projects: { [key: string]: number },
    sum_of_all: number,
  ): ChartData {
    const top_projects_rest =
      sum_of_all -
      Object.keys(top_projects).reduce((a, v) => (a = a + top_projects[v]), 0);
    const top_projects_data = [
      ...Object.keys(top_projects).map((key) => ({
        x: `${key.replace("https://", "")}`,
        y: top_projects[key],
      })),
      { x: "other projects", y: top_projects_rest },
    ];
    const top_projects_legend = [
      ...Object.keys(top_projects).map((key) => ({
        name: `${key.replace("https://", "")}: ${
          top_projects[key]
        } (${Math.floor((100 * top_projects[key]) / sum_of_all)}%)`,
      })),
      { name: `other projects: ${top_projects_rest}` },
    ];
    return [top_projects_data, top_projects_legend];
  }

  type InstanceChartData = [
    instances_to_chart_data: { x: string; y: number }[],
    instances_to_chart_legend: { name: string }[],
    instances_to_chart_count: number,
  ];
  function getInstanceChartData(instances: {
    [key: string]: number;
  }): InstanceChartData {
    const instances_to_chart_data = Object.keys(instances).map((key) => ({
      x: `${key}`,
      y: instances[key],
    }));
    const instances_to_chart_legend = Object.keys(instances).map((key) => ({
      name: `${key}: ${instances[key]}`,
    }));
    const instances_to_chart_count = Object.keys(instances).reduce(
      (a, v) => (a = a + instances[v]),
      0,
    );
    return [
      instances_to_chart_data,
      instances_to_chart_legend,
      instances_to_chart_count,
    ];
  }

  function getProjectChart(
    data_and_labels: ChartData,
    job_name: string,
    total_number: number,
    active_project_number: number,
  ) {
    return (
      <FlexItem>
        <Card>
          <CardTitle>{job_name}</CardTitle>
          <CardBody>
            <Flex>
              <FlexItem>
                <ChartDonut
                  ariaDesc={
                    "Number of " + `${job_name}` + " triggered for top projects"
                  }
                  ariaTitle={
                    "Number of " + `${job_name}` + " triggered for top projects"
                  }
                  constrainToVisibleArea
                  data={data_and_labels[0]}
                  labels={({ datum }) => `${datum.x}: ${datum.y}`}
                  subTitle={job_name}
                  title={total_number.toString()}
                  width={200}
                  padding={{
                    bottom: 20,
                    left: 20,
                    right: 20,
                    top: 20,
                  }}
                />
              </FlexItem>
              <FlexItem>
                <ChartDonut
                  ariaDesc="Chart showing number of active projects"
                  ariaTitle="Chart showing number of active projects"
                  constrainToVisibleArea
                  data={[
                    {
                      x: "Active projects",
                      y: active_project_number > 0 ? 100 : 0,
                    },
                  ]}
                  labels={({ datum }) => `${datum.x}`}
                  subTitle="Active projects"
                  title={active_project_number.toString()}
                  width={200}
                  padding={{
                    bottom: 20,
                    left: 20,
                    right: 20,
                    top: 20,
                  }}
                />
              </FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </FlexItem>
    );
  }
  function getInstanceChart(
    data_and_labels_total_number: InstanceChartData,
    job_name: string,
  ) {
    return (
      <FlexItem>
        <Card>
          <CardBody>
            <ChartDonut
              ariaDesc="Number of projects on each instance"
              ariaTitle="Number of projects on each instance"
              constrainToVisibleArea={true}
              data={data_and_labels_total_number[0]}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              legendData={data_and_labels_total_number[1]}
              legendOrientation="vertical"
              legendPosition="right"
              padding={{
                bottom: 20,
                left: 20,
                right: 250, // Adjusted to accommodate legend
                top: 20,
              }}
              subTitle={job_name}
              title={data_and_labels_total_number[2].toString()}
              width={424}
            />
          </CardBody>
        </Card>
      </FlexItem>
    );
  }

  // function getGoalProgress() {
  //   if (props.what != "total") {
  //     return <></>;
  //   }
  //   const goalDescription =
  //     data.jobs.sync_release_runs.active_projects.toString() +
  //     " projects (" +
  //     ((data.jobs.sync_release_runs.active_projects / 200) * 100).toString() +
  //     "%)";
  //   return (
  //     <Card>
  //       <CardTitle>Packit goal for Q4/2023</CardTitle>
  //       <CardBody>
  //         <Flex>
  //           <Card>
  //             <CardTitle>
  //               Sync release used by 200 projects by the end of 2023.
  //             </CardTitle>
  //             <CardBody>
  //               <ChartBullet
  //                 ariaDesc="Chart describing onboarding for release syncing"
  //                 ariaTitle="Chart describing onboarding for release syncing"
  //                 constrainToVisibleArea
  //                 labels={({ datum }) => `${datum.name}: ${datum.y}`}
  //                 maxDomain={{ y: 200 }}
  //                 name="Chart describing onboarding for release syncing"
  //                 primarySegmentedMeasureData={[
  //                   {
  //                     name: "Onboarded projects",
  //                     y: data.jobs.sync_release_runs.active_projects,
  //                   },
  //                 ]}
  //                 qualitativeRangeData={[
  //                   { name: "Q3 state", y: 124 },
  //                   { name: "Q4 goal", y: 200 },
  //                 ]}
  //                 height={150}
  //                 width={424}
  //               />
  //             </CardBody>
  //           </Card>
  //         </Flex>
  //       </CardBody>
  //     </Card>
  //   );
  // }

  function getGoalProgress2024Q1() {
    if (props.what != "total") {
      return <></>;
    }
    return (
      <Card>
        <CardTitle>Packit onboarded projects with downstream jobs</CardTitle>
        <CardBody>
          <Flex>
            <Card>
              <CardTitle>
                Projects with a merged downstream PR, Koji build or Bodhi update
              </CardTitle>
              <CardBody>
                <ChartBullet
                  ariaDesc="Chart describing downstream onboarding."
                  ariaTitle="Chart describing downstream onboarding."
                  constrainToVisibleArea
                  labels={({ datum }) => `${datum.name}: ${datum.y}`}
                  name="Chart describing downstream onboarding."
                  primarySegmentedMeasureData={[
                    {
                      name: "Onboarded projects",
                      y: data.onboarded_projects_q1_2024,
                    },
                  ]}
                  height={150}
                  width={424}
                />
              </CardBody>
            </Card>
          </Flex>
        </CardBody>
      </Card>
    );
  }

  function getReadableJobName(job_name: string) {
    return job_name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const active_projects_instance_chart = getInstanceChart(
    getInstanceChartData(data.active_projects.instances),
    "Active projects",
  );

  const job_charts = Object.keys(data.jobs).map((key) =>
    getProjectChart(
      getChartData(
        data.jobs[key].top_projects_by_job_runs,
        data.jobs[key].job_runs,
      ),
      getReadableJobName(key.replaceAll("_", " "))
        .replace(" Groups", "s")
        .replace(" Targets", "s")
        .replace("Vm", "VM")
        .replace("Tft", "TFT")
        .replace("Srpm", "SRPM"),
      data.jobs[key].job_runs,
      data.jobs[key].active_projects,
    ),
  );

  return (
    <>
      <Card>
        <CardBody>
          <Flex>{active_projects_instance_chart}</Flex>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Flex>{job_charts}</Flex>
        </CardBody>
      </Card>
      {getGoalProgress2024Q1()}
    </>
  );
};

export { UsageList };

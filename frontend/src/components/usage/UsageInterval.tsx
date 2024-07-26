// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  PageSection,
  Card,
  CardBody,
  CardTitle,
  Title,
  Flex,
  FlexItem,
  LabelGroup,
  Label,
} from "@patternfly/react-core";
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  createContainer,
  ChartLegendTooltip,
  ChartThemeColor,
} from "@patternfly/react-charts";

import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../Preloader";
import { useQuery } from "@tanstack/react-query";
import { UsageListData } from "./UsageListData";
import { ForgeIcon } from "../../app/Forge/ForgeIcon";

const fetchDataByGranularity = (granularity: UsageIntervalProps) =>
  fetch(
    `${import.meta.env.VITE_API_URL}/usage/intervals?days=${
      granularity.days
    }&hours=${granularity.hours}&count=${granularity.count}`,
  ).then((response) => {
    if (!response.ok) {
      throw Promise.reject(response);
    }
    return response.json();
  });

interface UsageIntervalProps {
  days: number;
  hours: number;
  count: number;
}

const UsageInterval: React.FC<UsageIntervalProps> = (props) => {
  const { data, isLoading, isError } = useQuery<UsageListData>({
    queryKey: [
      "usage-intervals",
      { days: props.days, hours: props.hours, count: props.count },
    ],
    queryFn: () => fetchDataByGranularity(props),
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
      <PageSection>
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

  function getReadableName(job_name: string) {
    return job_name
      .replaceAll("_", " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(" Groups", "s")
      .replace(" Targets", "s")
      .replace("Vm", "VM")
      .replace("Tft", "TFT")
      .replace("Srpm", "SRPM");
  }

  function getChartLine(
    line_data: [{ name: string; x: string; y: number }],
    name: string,
  ) {
    return <ChartLine data={line_data} name={getReadableName(name)} />;
  }

  function getLineChart(keysToShow, dataMapping, description) {
    const CursorVoronoiContainer = createContainer("voronoi", "cursor");
    const jobChartLineLegendData = keysToShow.map((key) => ({
      childName: getReadableName(key),
      name: getReadableName(key),
    }));
    const jobChartLines = keysToShow.map((key, i) =>
      getChartLine(dataMapping[key], key),
    );

    return (
      <FlexItem>
        <Card>
          <CardBody>
            <div style={{ height: "250px", width: "500px" }}>
              <Chart
                ariaDesc="Packit usage trend chart"
                ariaTitle={`${description} (interval: ${props.days} days ${props.hours} hours)`}
                containerComponent={
                  <CursorVoronoiContainer
                    cursorDimension="x"
                    labels={({ datum }) => `${datum.y}`}
                    constrainToVisibleArea
                    labelComponent={
                      <ChartLegendTooltip
                        legendData={jobChartLineLegendData}
                        title={(datum) => datum.x}
                      />
                    }
                    mouseFollowTooltips
                    voronoiDimension="x"
                  />
                }
                legendData={jobChartLineLegendData}
                legendOrientation="vertical"
                legendPosition="right"
                minDomain={{ y: 0 }}
                themeColor={ChartThemeColor.multiUnordered}
                padding={{
                  bottom: 50,
                  left: 0, // Adjusted to accommodate axis label
                  right: 100, // Adjusted to accommodate legend
                  top: 20,
                }}
              >
                <ChartAxis tickCount={3} />
                <ChartAxis
                  dependentAxis
                  showGrid
                  label={`interval: ${props.days} day(s) ${props.hours} hour(s)`}
                />
                <ChartGroup>{jobChartLines}</ChartGroup>
              </Chart>
            </div>
          </CardBody>
        </Card>
      </FlexItem>
    );
  }

  function getListOfNewProjects(projects, categoryName, color) {
    return (
      <LabelGroup categoryName={getReadableName(categoryName) + ":"}>
        {projects.map((project) => (
          <Label
            variant="outline"
            color="blue"
            href={project}
            icon={<ForgeIcon url={project} />}
          >
            {project.replace("https://", "")}
          </Label>
        ))}
      </LabelGroup>
    );
  }

  function getListOfNewProjectsForJobs(projectsForJobs) {
    return (
      <>
        {Object.keys(projectsForJobs).map((job) => (
          <>{getListOfNewProjects(projectsForJobs[job], job)}</>
        ))}
      </>
    );
  }

  return (
    <>
      <Card>
        <CardTitle>Project activity</CardTitle>
        <CardBody>
          <Flex>
            {getLineChart(
              ["active_projects"],
              data,
              "Number of active projects",
            )}
            {getLineChart(
              Object.keys(data.events),
              data.events,
              "Number of processed events",
            )}
          </Flex>
        </CardBody>
      </Card>
      <Card>
        <CardTitle>Processed jobs</CardTitle>
        <CardBody>
          <Flex>
            {getLineChart(
              Object.keys(data.jobs).filter(
                (obj) => obj !== "sync_release_runs",
              ),
              data.jobs,
              "Number of processed jobs",
            )}
            {getLineChart(
              ["sync_release_runs"],
              data.jobs,
              "Number of synced releases",
            )}
          </Flex>
        </CardBody>
      </Card>
      <Card>
        <CardTitle>Active projects</CardTitle>
        <CardBody>
          <Flex>
            {getLineChart(
              Object.keys(data.jobs_project_count).filter(
                (obj) => obj !== "sync_release_runs",
              ),
              data.jobs_project_count,
              "Number of projects with processed jobs of this type",
            )}
            {getLineChart(
              ["sync_release_runs"],
              data.jobs_project_count,
              "Number of projects with synced releases",
            )}
          </Flex>
        </CardBody>
      </Card>
      <Card>
        <CardTitle>Onboarded projects</CardTitle>
        <CardBody>
          <Flex>
            {getLineChart(
              Object.keys(data.jobs_project_cumulative_count),
              data.jobs_project_cumulative_count,
              "Cumulative number of projects with at least a single job run",
            )}
            {getLineChart(
              ["active_projects_cumulative"],
              data,
              "Active projects",
            )}
            <FlexItem>
              <Card>
                <CardTitle>New projects:</CardTitle>
                <CardBody>
                  {getListOfNewProjects(data.onboarded_projects, "New setup")}
                  {getListOfNewProjectsForJobs(data.onboarded_projects_per_job)}
                </CardBody>
              </Card>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};

export { UsageInterval };

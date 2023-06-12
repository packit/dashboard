import {
    PageSection,
    Card,
    CardBody,
    Title,
    Flex,
    FlexItem,
} from "@patternfly/react-core";
import {
    Chart,
    ChartAxis,
    ChartGroup,
    ChartLine,
    createContainer,
    ChartLegendTooltip,
} from "@patternfly/react-charts";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { useQuery } from "@tanstack/react-query";
import { UsageListData } from "./UsageListData";

const fetchDataByGranularity = (granularity: UsageIntervalProps) =>
    fetch(
        `/api/usage/intervals?days=${granularity.days}&hours=${granularity.hours}&count=${granularity.count}`,
    ).then((response) => response.json());

interface UsageIntervalProps {
    days: number;
    hours: number;
    count: number;
}

const UsageInterval: React.FC<UsageIntervalProps> = (props) => {
    const { data, isInitialLoading, isError } = useQuery<UsageListData>(
        [`usage-intervals-${props.days}-${props.hours}&-${props.count}`],
        () => fetchDataByGranularity(props),
        {
            keepPreviousData: true,
        },
    );

    // If backend API is down
    if (isError) {
        return <ErrorConnection />;
    }

    // Show preloader if waiting for API data
    if (isInitialLoading) {
        return <Preloader />;
    }

    if (!data || "error" in data) {
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
        var CursorVoronoiContainer = createContainer("voronoi", "cursor");
        var jobChartLineLegendData = keysToShow.map((key) => ({
            childName: getReadableName(key),
            name: getReadableName(key),
        }));
        var jobChartLines = keysToShow.map((key, i) =>
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
                                                legendData={
                                                    jobChartLineLegendData
                                                }
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

    return (
        <>
            <Card>
                <CardBody>
                    <Flex>
                        {getLineChart(
                            Object.keys(data.jobs),
                            data.jobs,
                            "Number of processed jobs",
                        )}
                        {getLineChart(
                            ["sync_release_runs"],
                            data.jobs,
                            "Number of synced releases",
                        )}
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
        </>
    );
};

export { UsageInterval };

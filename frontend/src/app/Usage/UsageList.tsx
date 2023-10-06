import {
    PageSection,
    Card,
    CardBody,
    Title,
    Flex,
    FlexItem,
} from "@patternfly/react-core";
import { ChartDonut } from "@patternfly/react-charts";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { useQuery } from "@tanstack/react-query";
import { UsageListData } from "./UsageListData";

const fetchDataByGranularity = (granularity: UsageListProps["what"]) =>
    fetch(`/api/usage/${granularity}`).then((response) => response.json());

interface UsageListProps {
    what: "past-day" | "past-week" | "past-month" | "past-year" | "total";
}

const UsageList: React.FC<UsageListProps> = (props) => {
    const { data, isInitialLoading, isError } = useQuery<UsageListData>(
        ["usage" + props.what],
        () => fetchDataByGranularity(props.what),
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
            Object.keys(top_projects).reduce(
                (a, v) => (a = a + top_projects[v]),
                0,
            );
        const top_projects_data = [
            ...Object.keys(top_projects).map((key, i) => ({
                x: `${key.replace("https://", "")}`,
                y: top_projects[key],
            })),
            { x: "other projects", y: top_projects_rest },
        ];
        const top_projects_legend = [
            ...Object.keys(top_projects).map((key, i) => ({
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
        const instances_to_chart_data = Object.keys(instances)
            .filter((inst) => !inst.includes("fedoraproject.org"))
            .map((key, i) => ({
                x: `${key}`,
                y: instances[key],
            }));
        const instances_to_chart_legend = Object.keys(instances)
            .filter((inst) => !inst.includes("fedoraproject.org"))
            .map((key, i) => ({
                name: `${key}: ${instances[key]}`,
            }));
        const instances_to_chart_count = Object.keys(instances)
            .filter((inst) => !inst.includes("fedoraproject.org"))
            .reduce((a, v) => (a = a + instances[v]), 0);
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
    ) {
        return (
            <FlexItem>
                <Card>
                    <CardBody>
                        <ChartDonut
                            ariaDesc={
                                "Number of " +
                                `${job_name}` +
                                " triggered for top projects"
                            }
                            ariaTitle={
                                "Number of " +
                                `${job_name}` +
                                " triggered for top projects"
                            }
                            constrainToVisibleArea={true}
                            data={data_and_labels[0]}
                            labels={({ datum }) => `${datum.x}: ${datum.y}`}
                            legendData={data_and_labels[1]}
                            legendOrientation="vertical"
                            legendPosition="right"
                            padding={{
                                bottom: 20,
                                left: 0,
                                right: 350, // Adjusted to accommodate legend
                                top: 20,
                            }}
                            subTitle={job_name}
                            title={total_number.toString()}
                            width={500}
                        />
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
                            ariaDesc="Number of project on each instance"
                            ariaTitle="Number of project on each instance"
                            constrainToVisibleArea={true}
                            data={data_and_labels_total_number[0]}
                            labels={({ datum }) => `${datum.x}: ${datum.y}`}
                            legendData={data_and_labels_total_number[1]}
                            legendOrientation="vertical"
                            legendPosition="right"
                            padding={{
                                bottom: 20,
                                left: 0,
                                right: 350, // Adjusted to accommodate legend
                                top: 20,
                            }}
                            subTitle={job_name}
                            title={data_and_labels_total_number[2].toString()}
                            width={500}
                        />
                    </CardBody>
                </Card>
            </FlexItem>
        );
    }

    function getReadableJobName(job_name: string) {
        return job_name
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    const all_projects_instance_chart = getInstanceChart(
        getInstanceChartData(data.all_projects.instances),
        "All projects",
    );
    const active_projects_instance_chart = getInstanceChart(
        getInstanceChartData(data.active_projects.instances),
        "Active projects",
    );

    const job_charts = Object.keys(data.jobs).map((key, i) =>
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
        ),
    );

    return (
        <>
            <Card>
                <CardBody>
                    <Flex>
                        {all_projects_instance_chart}
                        {active_projects_instance_chart}
                    </Flex>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <Flex>{job_charts}</Flex>
                </CardBody>
            </Card>
        </>
    );
};

export { UsageList };

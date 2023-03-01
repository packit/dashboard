import React, { useState, useEffect } from "react";
import {
    PageSection,
    Card,
    CardBody,
    PageSectionVariants,
    TextContent,
    Text,
    Title,
} from "@patternfly/react-core";

import {
    Table,
    TableHeader,
    TableBody,
    TableVariant,
    cellWidth,
} from "@patternfly/react-table";
import { ChartDonut } from "@patternfly/react-charts";

import ConnectionError from "../error";
import Preloader from "../preloader";
import TriggerLink from "../trigger_link";
import { StatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";
import { useParams } from "react-router-dom";

const UsageComponent = (props) => {
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState({});
    const top = 5;

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/usage/" + props.what)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }, []);

    // If backend API is down
    if (hasError) {
        return <ConnectionError />;
    }

    // Show preloader if waiting for API data
    if (!loaded) {
        return <Preloader />;
    }

    // console.log(data);

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

    function getChartData(top_projects, sum_of_all) {
        const top_projects_rest =
            sum_of_all -
            Object.keys(top_projects).reduce(
                (a, v) => (a = a + top_projects[v]),
                0
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

    function getInstanceChartData(instances) {
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

    function getProjectChart(data_and_labels, job_name, total_number) {
        return (
            <div style={{ height: "300px", width: "660px" }}>
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
                        left: 20,
                        right: 380, // Adjusted to accommodate legend
                        top: 20,
                    }}
                    subTitle={job_name}
                    title={total_number}
                    width={550}
                />
            </div>
        );
    }
    function getInstanceChart(data_and_labels_total_number, job_name) {
        return (
            <div style={{ height: "300px", width: "660px" }}>
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
                        left: 20,
                        right: 380, // Adjusted to accommodate legend
                        top: 20,
                    }}
                    subTitle={job_name}
                    title={data_and_labels_total_number[2]}
                    width={550}
                />
            </div>
        );
    }

    function getReadableJobName(job_name) {
        return job_name
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    const all_projects_instance_chart = getInstanceChart(
        getInstanceChartData(data.all_projects.instances),
        "All projects"
    );
    const active_projects_instance_chart = getInstanceChart(
        getInstanceChartData(data.active_projects.instances),
        "Active projects"
    );

    const job_charts = Object.keys(data.jobs).map((key, i) =>
        getProjectChart(
            getChartData(
                data.jobs[key].top_projects_by_job_runs,
                data.jobs[key].job_runs
            ),
            getReadableJobName(key.replaceAll("_", " "))
                .replace(" Groups", "s")
                .replace(" Targets", "s")
                .replace("Vm", "VM")
                .replace("Tft", "TFT")
                .replace("Srpm", "SRPM"),
            data.jobs[key].job_runs
        )
    );

    return (
        <div>
            <PageSection>
                <Card>
                    <CardBody>
                        {all_projects_instance_chart}
                        {active_projects_instance_chart}
                    </CardBody>
                </Card>
            </PageSection>
            <PageSection>
                <Card>
                    <CardBody>{job_charts}</CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export default UsageComponent;

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

import ConnectionError from "../error";
import Preloader from "../preloader";
import TriggerLink from "../trigger_link";
import { StatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";
import { useParams } from "react-router-dom";

const UsageTable = () => {
    // Headings
    const columns = [
        {
            title: <span className="pf-u-screen-reader">Forge</span>,
            transforms: [cellWidth(5)],
        }, // space for forge icon
        { title: "Trigger", transforms: [cellWidth(15)] },
        { title: "Chroots", transforms: [cellWidth(60)] },
        { title: "Time Submitted", transforms: [cellWidth(10)] },
        { title: "Copr Build", transforms: [cellWidth(10)] },
    ];

    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState({});
    const top = 5;

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/usage?top=${top}`)
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

    const projects_to_list = Object.keys(
        data.active_projects.top_projects_by_events_handled
    ).map((key, i) => (
        <tr>
            <td>
                <a href={key}>{key}</a>
            </td>
            <td>{data.active_projects.top_projects_by_events_handled[key]}</td>
        </tr>
    ));

    const projects_to_list_copr_builds = Object.keys(
        data.jobs.copr_build_groups.top_projects_by_job_runs
    ).map((key, i) => (
        <tr>
            <td>
                <a href={key}>{key}</a>
            </td>
            <td>{data.jobs.copr_build_groups.top_projects_by_job_runs[key]}</td>
        </tr>
    ));

    const projects_to_list_test_runs = Object.keys(
        data.jobs.tft_test_run_groups.top_projects_by_job_runs
    ).map((key, i) => (
        <tr>
            <td>
                <a href={key}>{key}</a>
            </td>
            <td>
                {data.jobs.tft_test_run_groups.top_projects_by_job_runs[key]}
            </td>
        </tr>
    ));

    const instances_to_list = Object.keys(data.all_projects.instances).map(
        (key, i) => (
            <tr>
                <td>{key}</td>
                <td>
                    <a href={`projects/${key}`}>
                        {data.all_projects.instances[key]}
                    </a>
                </td>
                <td>{data.active_projects.instances[key]}</td>
            </tr>
        )
    );

    return (
        <div>
            <PageSection>
                <table
                    className="pf-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="Projects Table"
                >
                    <tbody>
                        <tr>
                            <td>
                                <strong>All projects</strong>
                            </td>
                            <td>{data.all_projects.project_count}</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Active projects</strong>
                            </td>
                            <td>{data.active_projects.project_count}</td>
                        </tr>
                    </tbody>
                </table>
            </PageSection>

            <PageSection>
                <table
                    className="pf-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="Instances"
                >
                    <tbody>
                        <tr>
                            <td>
                                <strong>Instance</strong>
                            </td>
                            <td>
                                <strong>Number of all projects</strong>
                            </td>
                            <td>
                                <strong>Number of active projects</strong>
                            </td>
                        </tr>
                        {instances_to_list}
                    </tbody>
                </table>
            </PageSection>

            <PageSection>
                <table
                    className="pf-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="TOP Active Projects Table"
                >
                    <tbody>
                        <tr>
                            <td>
                                <strong>TOP {top} Active projects</strong>
                            </td>
                            <td>
                                <strong>Number of events</strong>
                            </td>
                        </tr>
                        {projects_to_list}
                    </tbody>
                </table>
            </PageSection>

            <PageSection>
                <table
                    className="pf-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="TOP Build Projects Table"
                >
                    <tbody>
                        <tr>
                            <td>
                                <strong>Copr Builds TOP {top} projects</strong>
                            </td>
                            <td>
                                <strong>Number of Copr builds</strong>
                            </td>
                        </tr>
                        {projects_to_list_copr_builds}
                    </tbody>
                </table>
            </PageSection>

            <PageSection>
                <table
                    className="pf-c-table pf-m-compact pf-m-grid-md"
                    role="grid"
                    aria-label="TOP Test Projects Table"
                >
                    <tbody>
                        <tr>
                            <td>
                                <strong>Test Runs TOP {top} projects</strong>
                            </td>
                            <td>
                                <strong>Number of Copr builds</strong>
                            </td>
                        </tr>
                        {projects_to_list_test_runs}
                    </tbody>
                </table>
            </PageSection>
        </div>
    );
};

export default UsageTable;

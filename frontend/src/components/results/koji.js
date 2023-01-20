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

import ConnectionError from "../error";
import Preloader from "../preloader";
import TriggerLink from "../trigger_link";
import { StatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";
import { useParams } from "react-router-dom";

const ResultsPageKoji = () => {
    let { id } = useParams();

    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/koji-builds/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }, [id]);

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

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Koji Build Results</Text>
                    <StatusLabel
                        target={data.chroot}
                        status={data.status}
                        link={data.web_url}
                    />
                    <Text component="p">
                        <strong>
                            <TriggerLink builds={data} />
                        </strong>
                        <br />
                    </Text>
                </TextContent>
            </PageSection>

            <PageSection>
                <Card>
                    <CardBody>
                        <table
                            className="pf-c-table pf-m-compact pf-m-grid-md"
                            role="grid"
                            aria-label="Builds Table"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>SRPM Build</strong>
                                    </td>
                                    <td>
                                        <a
                                            href={`/results/srpm-builds/${data.srpm_build_id}`}
                                        >
                                            SRPM Logs
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Koji URL</strong>
                                    </td>
                                    <td>
                                        <a href={data.web_url}>Web URL</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Build Logs</strong>
                                    </td>
                                    <td>
                                        <a href={data.build_logs_url}>
                                            Build Logs URL
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <strong>Build Submission Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.build_submitted_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Build Start Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.build_start_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Build Finish Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.build_finished_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Commit SHA</strong>
                                    </td>
                                    <td>{data.commit_sha}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export { ResultsPageKoji };

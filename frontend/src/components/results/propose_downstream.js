import React, { useState, useEffect } from "react";
import {
    PageSection,
    Card,
    CardBody,
    PageSectionVariants,
    TextContent,
    Text,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
} from "@patternfly/react-core";

import ConnectionError from "../error";
import Preloader from "../preloader";
import TriggerLink from "../trigger_link";
import { ProposeDownstreamTargetStatusLabel } from "../status_labels";
import { Timestamp } from "../../utils/time";
import { LogViewer, LogViewerSearch } from "@patternfly/react-log-viewer";
import { useParams } from "react-router-dom";

const ResultsPageProposeDownstream = () => {
    let { id } = useParams();

    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/propose-downstream/${id}`)
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

    const linkToDownstreamPR = data.downstream_pr_url ? (
        <a href={data.downstream_pr_url}>Click here</a>
    ) : (
        <>Link will be available after successful downstream PR submission.</>
    );

    const logs = (
        <PageSection>
            <Card>
                <CardBody>
                    <LogViewer
                        data={
                            data.logs ? data.logs : "Log is not available yet."
                        }
                        toolbar={
                            <Toolbar>
                                <ToolbarContent>
                                    <ToolbarItem>
                                        <LogViewerSearch placeholder="Search value" />
                                    </ToolbarItem>
                                </ToolbarContent>
                            </Toolbar>
                        }
                        hasLineNumbers={false}
                    />
                </CardBody>
            </Card>
        </PageSection>
    );

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Propose Downstream Results</Text>
                    <ProposeDownstreamTargetStatusLabel
                        status={data.status}
                        target={data.branch}
                        link={data.downstream_pr_url}
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
                            aria-label="Propose table"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Status</strong>
                                    </td>
                                    <td>{data.status}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Submission Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.submitted_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Start Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.start_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Finish Time</strong>
                                    </td>
                                    <td>
                                        <Timestamp
                                            stamp={data.finished_time}
                                            verbose={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>Link to downstream PR</strong>
                                    </td>
                                    <td>{linkToDownstreamPR}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </PageSection>
            {logs}
        </div>
    );
};

export { ResultsPageProposeDownstream };

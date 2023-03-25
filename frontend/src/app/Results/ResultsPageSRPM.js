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
import { LogViewer, LogViewerSearch } from "@patternfly/react-log-viewer";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/time";
import { useParams } from "react-router-dom";

const ResultsPageSRPM = () => {
    let { id } = useParams();

    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/srpm-builds/${id}`)
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
        return <ErrorConnection />;
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

    const srpmURL = data.url ? (
        <a href={data.url}>Link to download</a>
    ) : (
        "Not available to download"
    );

    const submittedAt = data.build_submitted_time ? (
        <Timestamp stamp={data.build_submitted_time} verbose={true} />
    ) : (
        "not available"
    );

    const startedAt = data.build_start_time ? (
        <Timestamp stamp={data.build_start_time} verbose={true} />
    ) : (
        "not available"
    );

    const finishedAt = data.build_finished_time ? (
        <Timestamp stamp={data.build_finished_time} verbose={true} />
    ) : (
        "not available"
    );

    const coprLogsUrl = data.logs_url ? (
        <a href={data.logs_url}>Logs URL</a>
    ) : (
        "not available"
    );

    const coprInfo = data.copr_build_id ? (
        <Text component="p">
            Copr Web URL: <a href={data.copr_web_url}>URL</a>
            <br />
            Copr SRPM build logs: {coprLogsUrl}
        </Text>
    ) : (
        ""
    );

    const logs = data.copr_build_id ? (
        ""
    ) : (
        <PageSection>
            <Card>
                <CardBody>
                    <LogViewer
                        data={data.logs ? data.logs : "Log is not available"}
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
                    <Text component="h1">SRPM Build</Text>
                    <StatusLabel
                        status={data.status}
                        link={data.copr_web_url}
                    />
                    <Text component="p">
                        <strong>
                            <TriggerLink builds={data} />
                        </strong>
                        <br />
                        Submitted at: {submittedAt}
                        <br />
                        Started at: {startedAt}
                        <br />
                        Finished at: {finishedAt}
                        <br />
                    </Text>
                    {coprInfo}
                    <Text component="p">SRPM: {srpmURL}</Text>
                </TextContent>
            </PageSection>

            {logs}
        </div>
    );
};

export { ResultsPageSRPM };

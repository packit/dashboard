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
import { StatusLabel, toSRPMStatus } from "../status_labels";

const ResultsPageSRPM = (props) => {
    let id = props.match.params.id;

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

    const srpmURL = data.url ? (
        <a href={data.url}>Link to download</a>
    ) : (
        "Not available to download"
    );

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">SRPM Build</Text>
                    <StatusLabel status={toSRPMStatus(data.success)} />
                    <Text component="p">
                        <strong>
                            <TriggerLink builds={data} />
                        </strong>
                        <br />
                        Submitted at {data.build_submitted_time}
                    </Text>
                    <Text component="p">SRPM: {srpmURL}</Text>
                </TextContent>
            </PageSection>

            <PageSection>
                <Card>
                    <CardBody>
                        <div style={{ overflowX: "scroll" }}>
                            <pre>
                                <code>{data.logs}</code>
                            </pre>
                        </div>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};

export { ResultsPageSRPM };

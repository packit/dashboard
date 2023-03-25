import React, { useState, useEffect } from "react";
import {
    PageSection,
    Card,
    CardBody,
    PageSectionVariants,
    TextContent,
    Text,
    Title,
    Label,
} from "@patternfly/react-core";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { TFStatusLabel } from "../StatusLabel/TFStatusLabel";
import { useParams } from "react-router-dom";

const ResultsPageTestingFarm = () => {
    let { id } = useParams();

    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/testing-farm/${id}`)
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

    const statusWithLink = data.web_url ? (
        <a href={data.web_url}>{data.status}</a>
    ) : (
        <>{data.status}</>
    );

    function getCoprBuilds() {
        let coprBuilds = [];
        let title =
            data.copr_build_ids.length === 1 ? "Copr build" : "Copr builds";

        for (var i = 0; i < data.copr_build_ids.length; i++) {
            var coprBuildId = data.copr_build_ids[i];
            var linkText =
                data.copr_build_ids.length === 1
                    ? "Details"
                    : `Build ${i + 1}  `;
            coprBuilds.push(
                <Label href={`/results/copr-builds/${coprBuildId}`}>
                    {linkText}
                </Label>,
            );
        }

        return (
            <tr>
                <td>
                    <strong>{title}</strong>
                </td>
                <td>{coprBuilds}</td>
            </tr>
        );
    }

    data.copr_build_ids = data.copr_build_ids.filter((copr) => copr !== null);
    const coprBuildInfo = data.copr_build_ids.length > 0 ? getCoprBuilds() : "";

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">Testing Farm Results</Text>
                    <TFStatusLabel
                        status={data.status}
                        target={data.chroot}
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
                            aria-label="Testing farm table"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Status</strong>
                                    </td>
                                    <td>{statusWithLink}</td>
                                </tr>
                                {coprBuildInfo}
                                <tr>
                                    <td>
                                        <strong>Pipeline ID</strong>
                                    </td>
                                    <td>{data.pipeline_id}</td>
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

export { ResultsPageTestingFarm };

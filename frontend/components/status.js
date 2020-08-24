import React, { useState, useEffect } from "react";
import {
    PageSection,
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
} from "@patternfly/react-core";

import { CheckIcon } from "@patternfly/react-icons";
import ConnectionError from "./error";

const Status = () => {
    const [hasError, setErrors] = useState(false);
    const [title, setTitle] = useState("Checking....");

    function fetchHealth() {
        fetch(`${apiURL}/healthz`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "We are healthy!") {
                    setTitle("We are healthy!");
                }
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }

    // Executes fetchHealth on first render of component
    useEffect(() => {
        fetchHealth();
    }, []);

    // If backend API is down
    if (hasError) {
        return <ConnectionError />;
    }

    return (
        <PageSection>
            <EmptyState variant={EmptyStateVariant.full}>
                <EmptyStateIcon icon={CheckIcon} color="#3E8635" />
                <Title headingLevel="h1" size="lg">
                    {title}
                </Title>
            </EmptyState>
        </PageSection>
    );
};

export { Status };

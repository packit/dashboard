import React from "react";
import {
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    EmptyStateBody,
    Title,
} from "@patternfly/react-core";

import { ExclamationCircleIcon } from "@patternfly/react-icons";

const ConnectionError = () => (
    <EmptyState variant={EmptyStateVariant.small}>
        <EmptyStateIcon icon={ExclamationCircleIcon} color="#C9190B" />
        <Title headingLevel="h2" size="lg">
            Unable to connect
        </Title>
        <EmptyStateBody>There was an error retrieving data.</EmptyStateBody>
    </EmptyState>
);

export default ConnectionError;

import React from "react";
import {
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    EmptyStateBody,
    Title,
    Icon,
} from "@patternfly/react-core";

import { ExclamationTriangleIcon } from "@patternfly/react-icons";

const ErrorConnection = () => (
    <EmptyState variant={EmptyStateVariant.small}>
        <Icon>
            <EmptyStateIcon icon={ExclamationTriangleIcon} color="#f0ab00" />
        </Icon>
        <Title headingLevel="h2" size="lg">
            Unable to connect
        </Title>
        <EmptyStateBody>There was an error retrieving data.</EmptyStateBody>
    </EmptyState>
);

export { ErrorConnection };

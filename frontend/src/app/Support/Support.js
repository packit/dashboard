import * as React from "react";
import { CubesIcon } from "@patternfly/react-icons";
import {
    PageSection,
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
} from "@patternfly/react-core";

const Support = () => (
    <PageSection>
        <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h1" size="lg">
                Empty State
            </Title>
        </EmptyState>
    </PageSection>
);

export { Support };

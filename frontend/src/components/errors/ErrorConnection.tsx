// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
} from "@patternfly/react-core";

import { ExclamationTriangleIcon } from "@patternfly/react-icons";

const ErrorConnection = () => (
  <EmptyState
    headingLevel="h2"
    titleText="Unable to connect"
    variant={EmptyStateVariant.sm}
    icon={ExclamationTriangleIcon}
  >
    <EmptyStateBody>There was an error retrieving data.</EmptyStateBody>
  </EmptyState>
);

export { ErrorConnection };

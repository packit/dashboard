// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Icon,
} from "@patternfly/react-core";

import { ExclamationTriangleIcon } from "@patternfly/react-icons";

const ErrorConnection = () => (
  <EmptyState variant={EmptyStateVariant.sm}>
    <Icon>
      <EmptyStateIcon icon={ExclamationTriangleIcon} color="#f0ab00" />
    </Icon>
    <EmptyStateHeader titleText="Unable to connect" headingLevel="h2" />
    <EmptyStateBody>There was an error retrieving data.</EmptyStateBody>
  </EmptyState>
);

export { ErrorConnection };

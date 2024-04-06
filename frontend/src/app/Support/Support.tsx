// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { CubesIcon } from "@patternfly/react-icons";
import {
  PageSection,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateHeader,
} from "@patternfly/react-core";

const Support = () => (
  <PageSection>
    <EmptyState variant={EmptyStateVariant.full}>
      <EmptyStateHeader
        titleText="Empty State"
        icon={<EmptyStateIcon icon={CubesIcon} />}
        headingLevel="h1"
      />
    </EmptyState>
  </PageSection>
);

export { Support };

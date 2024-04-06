// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Alert, PageSection } from "@patternfly/react-core";

const NotFound = () => (
  <PageSection>
    <Alert variant="danger" title="404! This view hasn't been created yet." />
  </PageSection>
);

export { NotFound };

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { createFileRoute } from "@tanstack/react-router";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
} from "@patternfly/react-core";
import { PipelinesTable } from "../components/pipeline/PipelinesTable";

export const Route = createFileRoute("/pipeline")({
  staticData: {
    title: "Pipelines",
  },
  component: Pipelines,
});

function Pipelines() {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Pipelines</Text>
          <Text component="p">Pipelines run by Packit Service.</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <PipelinesTable />
      </PageSection>
    </>
  );
}

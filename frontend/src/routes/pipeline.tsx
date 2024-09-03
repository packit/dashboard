// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { createFileRoute } from "@tanstack/react-router";
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

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Content, PageSection } from "@patternfly/react-core";
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
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Pipelines</Content>
          <Content component="p">Pipelines run by Packit Service.</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <PipelinesTable />
      </PageSection>
    </>
  );
}

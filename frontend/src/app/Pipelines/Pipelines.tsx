import React from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
} from "@patternfly/react-core";

import { PipelinesTable } from "./PipelinesTable";
import { useTitle } from "../utils/useTitle";

const Pipelines = () => {
  useTitle("Pipelines");
  return (
    <div>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Pipelines</Text>
          <Text component="p">Pipelines run by Packit Service.</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <PipelinesTable />
      </PageSection>
    </div>
  );
};

export { Pipelines };

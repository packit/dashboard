// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { ForgeIcon } from "../icons/ForgeIcon";
import { ProjectsList } from "./ProjectsList";
import { Route as ForgeRoute } from "../../routes/projects/$forge_.lazy";

const Forge = () => {
  const { forge } = ForgeRoute.useParams();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="p">
            <ForgeIcon url={`https://${forge}`} /> {forge}
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <ProjectsList forge={forge} />
      </PageSection>
    </>
  );
};

export { Forge };

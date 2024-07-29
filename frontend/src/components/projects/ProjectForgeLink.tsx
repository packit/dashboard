// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Label } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { projectQueryOptions } from "../../queries/projects/projectQuery";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { ForgeIconByForge } from "../icons/ForgeIcon";

export const ProjectForgeLink: React.FC<{
  forge: string;
  namespace: string;
  repo: string;
}> = (params) => {
  const { data } = useQuery(projectQueryOptions(params));

  return (
    <>
      <Label color="blue" icon={<ForgeIconByForge forge={params.forge} />}>
        {params.forge}
      </Label>
      <span style={{ marginLeft: "10px" }}>
        {<ProjectLink link={data ? data.project_url : ""} />}
      </span>
    </>
  );
};

interface ProjectLinkProps {
  link: string;
}

const ProjectLink: React.FC<ProjectLinkProps> = (props) => {
  if (props.link === "") {
    return <></>;
  }
  return (
    <a href={props.link} target="_blank" rel="noreferrer">
      <ExternalLinkAltIcon />
    </a>
  );
};

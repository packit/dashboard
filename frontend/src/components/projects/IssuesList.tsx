// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React from "react";

import { getIssueLink } from "../forgeUrls";
import { List, ListItem } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { projectIssuesQueryOptions } from "../../queries/projects/projectIssuesQuery";

interface IssuesListProps {
  forge: string;
  namespace: string;
  repo: string;
}
const IssuesList: React.FC<IssuesListProps> = (props) => {
  const { data } = useQuery(projectIssuesQueryOptions(props));

  return (
    <List>
      {data ? (
        data?.map((issue) => (
          <ListItem key={issue}>
            <a
              href={getIssueLink(
                `https://${props.forge}/${props.namespace}/${props.repo}`,
                issue,
              )}
              rel="noreferrer"
              target="_blank"
            >
              #{issue}
            </a>
          </ListItem>
        ))
      ) : (
        <></>
      )}
    </List>
  );
};

export { IssuesList };

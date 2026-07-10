// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Card,
  CardBody,
  CodeBlock,
  CodeBlockCode,
  Content,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  ExpandableSection,
  PageSection,
  Title,
} from "@patternfly/react-core";

import { useQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import type { LogDetectiveSnippet } from "../../apiDefinitions";
import { logDetectiveResultQueryOptions } from "../../queries/logdetective/logDetectiveResultQuery";
import { Route as LogDetectiveRoute } from "../../routes/jobs_/log-detective.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../shared/Preloader";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";

// PF CodeBlock has very generous default padding; these overrides keep snippet rows compact.
// The `as` cast is needed because PF CSS custom properties aren't in the CSSProperties type.
const snippetBlockStyle = {
  "--pf-v6-c-code-block__content--PaddingBlockStart": "4px",
  "--pf-v6-c-code-block__content--PaddingBlockEnd": "4px",
  "--pf-v6-c-code-block__content--PaddingInlineStart": "8px",
  "--pf-v6-c-code-block__content--PaddingInlineEnd": "8px",
  overflow: "hidden",
} as CSSProperties;

// color-mix blends the PF theme background with a green tint, so it adapts to both light and dark mode
const analysisBlockStyle = {
  ...snippetBlockStyle,
  "--pf-v6-c-code-block--BackgroundColor":
    "color-mix(in srgb, var(--pf-t--global--background--color--secondary--default) 85%, #a3d977)",
} as CSSProperties;

// SnippetRow renders as a direct child of the SnippetsList grid
// so each element here becomes a grid item; should not be wrapped in a container div.
const SnippetRow = ({ snippet }: { snippet: LogDetectiveSnippet }) => (
  <>
    <Content
      style={{
        minWidth: "5ch",
        textAlign: "right" as const,
        fontFamily: "var(--pf-t--global--font--family--mono)",
        fontSize: "0.85em",
      }}
    >
      {snippet.line_number}:
    </Content>
    <CodeBlock style={snippetBlockStyle}>
      <CodeBlockCode
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {snippet.text}
      </CodeBlockCode>
    </CodeBlock>
    {snippet.snippet_analysis ? (
      <div
        style={{
          gridColumn: 2,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          columnGap: "16px",
          alignItems: "start",
        }}
      >
        <Content
          style={{
            fontFamily: "var(--pf-t--global--font--family--mono)",
            fontSize: "0.85em",
          }}
        >
          Analysis:
        </Content>
        <CodeBlock style={analysisBlockStyle}>
          <CodeBlockCode>{snippet.snippet_analysis}</CodeBlockCode>
        </CodeBlock>
      </div>
    ) : null}
  </>
);

const SnippetsList = ({
  snippets,
}: {
  snippets: LogDetectiveSnippet[];
}) => {
  const grouped = Object.groupBy(snippets, (s) => s.source_file);
  const sortedFiles = Object.keys(grouped).sort();

  return (
    <>
      {sortedFiles.map((file) => (
        <ExpandableSection
          key={file}
          toggleContent={
            <span
              style={{
                color: "var(--pf-t--global--text--color--regular)",
              }}
            >
              {file} ({grouped[file]!.length})
            </span>
          }
          isIndented
        >
          {/* CSS grid aligns line numbers and code blocks into columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              columnGap: "16px",
              rowGap: "8px",
              alignItems: "start",
              marginBlock: "8px",
            }}
          >
            {grouped[file]!.map((snippet, index) => (
              <SnippetRow
                key={`${snippet.line_number}-${index}`}
                snippet={snippet}
              />
            ))}
          </div>
        </ExpandableSection>
      ))}
    </>
  );
};

export const LogDetectiveResult = () => {
  const { id } = LogDetectiveRoute.useParams();

  const { data, isError, isLoading } = useQuery(
    logDetectiveResultQueryOptions({ id }),
  );

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  if (data && "error" in data) {
    return (
      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <Title headingLevel="h1" size="lg">
              Not Found.
            </Title>
          </CardBody>
        </Card>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Content>
          <Content component="h1">Log Detective Results</Content>
        </Content>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <Card>
          {!data ? (
            isLoading || data === undefined ? (
              <Preloader />
            ) : (
              <PageSection hasBodyWrapper={false}>
                <Card>
                  <CardBody>
                    <Title headingLevel="h1" size="lg">
                      Not Found.
                    </Title>
                  </CardBody>
                </Card>
              </PageSection>
            )
          ) : (
            <>
              <CardBody>
                <DescriptionList
                  columnModifier={{
                    default: "1Col",
                    sm: "2Col",
                  }}
                >
                  <DescriptionListGroup>
                    <DescriptionListTerm>Packit ID</DescriptionListTerm>
                    <DescriptionListDescription>
                      {data.packit_id}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Analysis ID</DescriptionListTerm>
                    <DescriptionListDescription>
                      {data.analysis_id}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Status</DescriptionListTerm>
                    <DescriptionListDescription>
                      <StatusLabel status={data.status} />
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Submitted Time</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Timestamp stamp={data.submitted_time} verbose={true} />
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  {data.target_build ? (
                    <DescriptionListGroup>
                      <DescriptionListTerm>Koji Build</DescriptionListTerm>
                      <DescriptionListDescription>
                        <a
                          href={`https://koji.fedoraproject.org/koji/taskinfo?taskID=${data.target_build}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {data.target_build}
                        </a>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  ) : null}
                </DescriptionList>
              </CardBody>
              {data.status === "complete" && data.log_detective_response ? (
                <CardBody>
                  <DescriptionList>
                    {data.log_detective_response.explanation?.text ? (
                      <DescriptionListGroup>
                        <DescriptionListTerm>Explanation</DescriptionListTerm>
                        <DescriptionListDescription>
                          <CodeBlock>
                            <CodeBlockCode>
                              {data.log_detective_response.explanation.text}
                            </CodeBlockCode>
                          </CodeBlock>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    ) : null}
                    {data.log_detective_response.solution?.text ? (
                      <DescriptionListGroup>
                        <DescriptionListTerm>Solution</DescriptionListTerm>
                        <DescriptionListDescription>
                          <CodeBlock>
                            <CodeBlockCode>
                              {data.log_detective_response.solution.text}
                            </CodeBlockCode>
                          </CodeBlock>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    ) : null}
                    {data.log_detective_response.snippets?.length ? (
                      <DescriptionListGroup>
                        <DescriptionListTerm>
                          Snippets (
                          {data.log_detective_response.snippets.length})
                        </DescriptionListTerm>
                        <DescriptionListDescription>
                          <SnippetsList
                            snippets={data.log_detective_response.snippets}
                          />
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    ) : null}
                  </DescriptionList>
                </CardBody>
              ) : null}
              {data.status === "error" && data.error_msg ? (
                <CardBody>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Error</DescriptionListTerm>
                      <DescriptionListDescription>
                        <CodeBlock>
                          <CodeBlockCode>{data.error_msg}</CodeBlockCode>
                        </CodeBlock>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              ) : null}
            </>
          )}
        </Card>
      </PageSection>
    </>
  );
};

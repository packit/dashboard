import {
  Button,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from "@patternfly/react-core";
import React from "react";

import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { useRouteError } from "react-router-dom";

const ErrorApp = () => {
  const error = useRouteError();
  console.error(error);
  const [copied, setCopied] = React.useState(false);

  const clipboardCopyFunc = (event: React.MouseEvent, text: string) => {
    navigator.clipboard.writeText(text);
  };

  const onClick = (event: React.MouseEvent, error: unknown) => {
    clipboardCopyFunc(event, error?.toString() || "Unknown error");
    setCopied(true);
  };

  const actions = (
    <CodeBlockAction>
      <ClipboardCopyButton
        id="basic-copy-button"
        textId="code-content"
        aria-label="Copy to clipboard"
        onClick={(e) => onClick(e, error)}
        exitDelay={copied ? 1500 : 600}
        maxWidth="110px"
        variant="plain"
        onTooltipHidden={() => setCopied(false)}
      >
        {copied ? "Successfully copied to clipboard!" : "Copy to clipboard"}
      </ClipboardCopyButton>
    </CodeBlockAction>
  );

  return (
    <EmptyState isFullHeight>
      <EmptyStateHeader
        titleText="Exception occured that caused the website to crash"
        icon={<EmptyStateIcon icon={ExclamationCircleIcon} color="#C9190B" />}
        headingLevel="h1"
      />
      <EmptyStateBody>
        If possible, take this callstack and report it upstream so it can be
        fixed. When reporting, specify the reproducer on how the bug happened.
      </EmptyStateBody>
      <EmptyStateFooter>
        <Button
          variant="primary"
          component="a"
          href="https://github.com/packit/dashboard/issues/new?title=Dashboard+crashed"
          target="_blank"
          rel="noreferrer"
        >
          Report the issue
        </Button>
        <EmptyStateActions>
          <Button variant="link" component="a" href="/">
            Go back to Packit website
          </Button>
        </EmptyStateActions>
        <EmptyStateBody>
          <CodeBlock actions={actions}>
            <CodeBlockCode id="code-content">
              {error?.toString() ?? "Unknown error"}
            </CodeBlockCode>
          </CodeBlock>
        </EmptyStateBody>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export { ErrorApp };

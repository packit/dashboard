// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Button,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
} from "@patternfly/react-core";
import React, { useEffect } from "react";

import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { ErrorComponentProps, useRouter } from "@tanstack/react-router";

export const ErrorApp: React.FC<ErrorComponentProps> = ({ error, reset }) => {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // Reset the query error boundary
    reset();
  }, [reset]);

  const clipboardCopyFunc = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  const onClick = (_event: React.MouseEvent, errorInst: typeof error) => {
    const clipboardMessage = `${errorInst.name} - ${errorInst.message}\n${error.stack}`;
    clipboardCopyFunc(clipboardMessage);
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
        <EmptyStateActions>
          <Button
            variant="primary"
            component="a"
            href="https://github.com/packit/dashboard/issues/new?title=Dashboard+crashed"
            target="_blank"
            rel="noreferrer"
          >
            Report the issue
          </Button>
          <Button
            variant="link"
            onClick={() => {
              // Invalidate the route to reload the loader, and reset any router error boundaries
              router.invalidate();
            }}
          >
            Retry
          </Button>
        </EmptyStateActions>
        <EmptyStateBody>
          <CodeBlock actions={actions}>
            {error.name} - {error.message}
            <CodeBlockCode id="code-content">
              {error.stack ?? "Unknown error"}
            </CodeBlockCode>
          </CodeBlock>
        </EmptyStateBody>
      </EmptyStateFooter>
    </EmptyState>
  );
};

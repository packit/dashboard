import {
    Button,
    ClipboardCopyButton,
    CodeBlock,
    CodeBlockAction,
    CodeBlockCode,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateSecondaryActions,
    Title,
} from "@patternfly/react-core";
import React from "react";

import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { useRouteError } from "react-router-dom";

const AppError = () => {
    const error = useRouteError();
    console.error(error);
    const [copied, setCopied] = React.useState(false);

    const clipboardCopyFunc = (event, text) => {
        navigator.clipboard.writeText(text.toString());
    };

    const onClick = (event, text) => {
        clipboardCopyFunc(event, text);
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
                {copied
                    ? "Successfully copied to clipboard!"
                    : "Copy to clipboard"}
            </ClipboardCopyButton>
        </CodeBlockAction>
    );

    return (
        <EmptyState isFullHeight>
            <EmptyStateIcon icon={ExclamationCircleIcon} color="#C9190B" />
            <Title headingLevel="h1" size="lg">
                Exception occured that caused the website to crash
            </Title>
            <EmptyStateBody>
                If possible, take this callstack and report it upstream so it
                can be fixed. When reporting, specify the reproducer on how the
                bug happened.
            </EmptyStateBody>
            <Button
                variant="primary"
                component="a"
                href="https://github.com/packit/dashboard/issues/new?title=Dashboard+crashed"
                target="_blank"
                rel="noreferrer"
            >
                Report the issue
            </Button>
            <EmptyStateSecondaryActions>
                <Button variant="link" component="a" href="/">
                    Go back to Packit website
                </Button>
            </EmptyStateSecondaryActions>
            <EmptyStateBody>
                <CodeBlock actions={actions}>
                    <CodeBlockCode id="code-content">
                        {error.toString()}
                    </CodeBlockCode>
                </CodeBlock>
            </EmptyStateBody>
        </EmptyState>
    );
};

export default AppError;

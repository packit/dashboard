// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Card,
  CardHeader,
  CardBody,
  Grid,
  GridItem,
  Page,
  PageSection,
  Title,
} from "@patternfly/react-core";
import {
  BugIcon,
  InfoCircleIcon,
  CodeIcon,
  BellIcon,
  CatalogIcon,
  OutlinedCommentsIcon,
} from "@patternfly/react-icons";
import { useTitle } from "../utils/useTitle";

const Dashboard = () => {
  useTitle("Homes");
  return (
    <>
      <PageSection>
        <Title headingLevel="h1">Packit Dashboard</Title>
      </PageSection>

      <PageSection>
        <Grid hasGutter>
          <GridItem lg={3}>
            <Card isFullHeight>
              <CardHeader>
                <CatalogIcon />
                &nbsp;<b>Documentation</b>
              </CardHeader>

              <CardBody>
                For documentation related to Packit tooling and Packit Service
                itself, see our <a href="https://packit.dev">homepage</a>.
              </CardBody>
            </Card>
          </GridItem>

          <GridItem lg={3}>
            <Card isFullHeight>
              <CardHeader>
                <BellIcon />
                &nbsp;<b>Blog posts</b>
              </CardHeader>

              <CardBody>
                If you want to know about latest features introduced to Packit
                and Packit Service, bug fixes and related work being done,
                follow our <a href="https://packit.dev/posts/">blog posts</a>.
              </CardBody>
            </Card>
          </GridItem>

          <GridItem lg={3}>
            <Card isFullHeight>
              <CardHeader>
                <BugIcon />
                &nbsp;<b>Issues</b>
              </CardHeader>

              <CardBody>
                If you ran into any issue, either using Packit Service or the
                tooling locally, try to find the project that is as closely
                related to your issue as possible (if you don't get it right, we
                can always fix it) and follow our guidelines regarding{" "}
                <a href="https://github.com/packit/contributing#reporting-bugs">
                  reporting issues
                </a>
                .
              </CardBody>
            </Card>
          </GridItem>

          <GridItem lg={3}>
            <Card isFullHeight>
              <CardHeader>
                <CodeIcon />
                &nbsp;<b>Source code on GitHub</b>
              </CardHeader>

              <CardBody>
                In case you would like to contribute to our code base, please
                refer to our{" "}
                <a href="https://github.com/packit">GitHub namespace</a>, choose
                a project of your liking and don't forget to follow our{" "}
                <a href="https://github.com/packit/contributing">
                  contribution guidelines
                </a>
                .
              </CardBody>
            </Card>
          </GridItem>

          <GridItem lg={3}>
            <Card isFullHeight>
              <CardHeader>
                <InfoCircleIcon />
                &nbsp;<b>Status page</b>
              </CardHeader>

              <CardBody>
                For current status of Packit Service have a look at{" "}
                <a href="https://status.packit.dev">our status page</a>.
              </CardBody>
            </Card>
          </GridItem>

          <GridItem lg={3}>
            <Card>
              <CardHeader>
                <OutlinedCommentsIcon />
                &nbsp;<b>Contact us</b>
              </CardHeader>

              <CardBody>
                If you want to contact us, choose one of the ways{" "}
                <a href="https://packit.dev/#contact">from our website</a>. All
                feedback is welcome!
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export { Dashboard };

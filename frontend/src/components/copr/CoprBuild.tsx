// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  PageSection,
  Card,
  CardBody,
  PageSectionVariants,
  TextContent,
  Text,
  Title,
  List,
  ListItem,
} from "@patternfly/react-core";

import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../shared/Preloader";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";
import { useQuery } from "@tanstack/react-query";
import { ResultsPageCoprDetails } from "./CoprBuildDetail";
import { coprBuildQueryOptions } from "../../queries/copr/coprBuildQuery";
import { Route as CoprRoute } from "../../routes/jobs_/copr.$id";
import { SHACopy } from "../shared/SHACopy";
import { CoprBuildPackage } from "../../apiDefinitions";

export const CoprBuild = () => {
  const { id } = CoprRoute.useParams();

  const { data, isError, isLoading } = useQuery(coprBuildQueryOptions({ id }));

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  // Show preloader if waiting for API data
  if (isLoading || data === undefined) {
    return <Preloader />;
  }

  if ("error" in data) {
    return (
      <PageSection>
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
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Copr Build Results</Text>
          <Text component="p">
            <strong>
              <TriggerLink trigger={data}>
                <TriggerSuffix trigger={data} />
              </TriggerLink>
              <SHACopy git_repo={data.git_repo} commit_sha={data.commit_sha} />
            </strong>
          </Text>
        </TextContent>
      </PageSection>

      <PageSection>
        <Card>
          <CardBody>
            <ResultsPageCoprDetails data={data} />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text component="p">
              <strong>
                You can install the built RPMs by following these steps:
              </strong>
            </Text>
            <br />
            <List>
              <ListItem>
                <code>sudo dnf install -y dnf-plugins-core</code>
              </ListItem>
              <ListItem>
                <code>
                  sudo dnf copr enable {data.copr_owner}/{data.copr_project}
                </code>
              </ListItem>
              {data.built_packages ? (
                <ListItem>
                  <code>
                    sudo dnf install -y{" "}
                    {getPackagesToInstall(data.built_packages).join(" ")}
                  </code>
                </ListItem>
              ) : (
                <></>
              )}
            </List>
            <Text component="p">
              <br />
              Please note that the RPMs should be used only in a testing
              environment.
            </Text>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

function getPackagesToInstall(built_packages: CoprBuildPackage[]) {
  const packagesToInstall = [];

  for (const packageDict of built_packages) {
    if (packageDict.arch !== "src") {
      const packageString =
        packageDict.name +
        "-" +
        (packageDict.epoch ? packageDict.epoch + ":" : "") +
        packageDict.version +
        "-" +
        packageDict.release +
        "." +
        packageDict.arch;
      packagesToInstall.push(packageString);
    }
  }
  return packagesToInstall;
}

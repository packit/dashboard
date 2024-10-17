// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Card,
  CardBody,
  Content,
  List,
  ListItem,
  PageSection,
  Title,
} from "@patternfly/react-core";

import { useQuery } from "@tanstack/react-query";
import { CoprBuildPackage } from "../../apiDefinitions";
import { coprBuildQueryOptions } from "../../queries/copr/coprBuildQuery";
import { Route as CoprRoute } from "../../routes/jobs_/copr.$id";
import { ErrorConnection } from "../errors/ErrorConnection";
import { Preloader } from "../shared/Preloader";
import { SHACopy } from "../shared/SHACopy";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";
import { CoprBuildDetail } from "./CoprBuildDetail";

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
          <Content component="h1">Copr Build Results</Content>
          <strong>
            <TriggerLink trigger={data}>
              <TriggerSuffix trigger={data} />
            </TriggerLink>
            <SHACopy
              project_url={data.project_url}
              commit_sha={data.commit_sha}
            />
          </strong>
        </Content>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <CoprBuildDetail data={data} />
          </CardBody>
        </Card>

        {data.built_packages ? (
          <>
            <Card>
              <CardBody>
                <Content component="p">
                  <strong>
                    You can install the built RPMs by following these steps:
                  </strong>
                </Content>
                <br />
                <List>
                  <ListItem>
                    <code>sudo dnf install -y dnf-plugins-core</code>
                  </ListItem>
                  <ListItem>
                    <code>
                      sudo dnf copr enable {data.copr_owner}/{data.copr_project}{" "}
                      {data.chroot}
                    </code>
                  </ListItem>
                  <ListItem>
                    <code>
                      sudo dnf install -y{" "}
                      {getPackagesToInstall(data.built_packages).join(" ")}
                    </code>
                  </ListItem>
                </List>
                <Content component="p">
                  <br />
                  Please note that the RPMs should be used only in a testing
                  environment.
                </Content>
              </CardBody>
            </Card>
          </>
        ) : (
          <></>
        )}
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

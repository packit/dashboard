// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import {
  Card,
  CardBody,
  ClipboardCopy,
  Content,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  List,
  ListItem,
  PageSection,
  Title,
} from "@patternfly/react-core";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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

  const [packagesToInstall, setPackagesToInstall] = useState<string[]>([]);

  useEffect(() => {
    if (data?.built_packages)
      setPackagesToInstall(getPackagesToInstall(data.built_packages));
  }, [data?.built_packages]);

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
                  <Title headingLevel="h2">Installation instructions</Title>
                  Please note that the RPMs should be used only in a testing
                  environment
                </Content>
                <Content component="p">
                  <Title headingLevel="h3">Repository</Title>
                  <List isPlain>
                    <ListItem>
                      <ClipboardCopy
                        hoverTip="Copy"
                        clickTip="Copied"
                        variant="inline-compact"
                        isCode
                      >
                        sudo dnf install -y 'dnf*-command(copr)'
                      </ClipboardCopy>
                    </ListItem>
                    <ListItem>
                      <ClipboardCopy
                        hoverTip="Copy"
                        clickTip="Copied"
                        variant="inline-compact"
                        isCode
                      >
                        {`sudo dnf copr enable ${data.copr_owner}/${data.copr_project} ${data.chroot}`}
                      </ClipboardCopy>
                    </ListItem>
                  </List>
                </Content>
                <Content component="p">
                  <Title headingLevel="h3">Built packages</Title>
                  {packagesToInstall.length <= 1 ? (
                    <>
                      <ClipboardCopy
                        hoverTip="Copy"
                        clickTip="Copied"
                        variant="inline-compact"
                        isCode
                      >
                        sudo dnf install -y {packagesToInstall.join(" ")}
                      </ClipboardCopy>
                    </>
                  ) : (
                    <>
                      <Title headingLevel="h4">All packages</Title>
                      <ClipboardCopy
                        hoverTip="Copy"
                        clickTip="Copied"
                        variant="inline-compact"
                        isCode
                      >
                        sudo dnf install -y {packagesToInstall.join(" ")}
                      </ClipboardCopy>
                      <Title headingLevel="h4">Individual packages</Title>
                      <List isPlain>
                        {packagesToInstall.map((pkg) => (
                          <ListItem>
                            <ClipboardCopy
                              hoverTip="Copy"
                              clickTip="Copied"
                              variant="inline-compact"
                              isCode
                            >
                              sudo dnf install -y {pkg}
                            </ClipboardCopy>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
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

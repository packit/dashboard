import * as React from "react";
import {
    PageSection,
    PageSectionVariants,
    Text,
    Tabs,
    Tab,
    TabTitleText,
    Card,
    CardBody,
    TextContent,
    Label,
} from "@patternfly/react-core";

import PullRequestList from "./pr";
import BranchList from "./branch";
import IssuesList from "./issues";
import ReleasesList from "./releases";

import { GithubIcon } from "@patternfly/react-icons";

const ProjectInfo = (props) => {
    let forge = props.match.params.forge;
    let namespace = props.match.params.namespace;
    let repoName = props.match.params.repoName;

    const [activeTabKey, setActiveTabKey] = React.useState(0);
    const handleTabClick = (event, tabIndex) => {
        setActiveTabKey(tabIndex);
    };

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <TextContent>
                    <Text component="h1">{`${namespace}/${repoName}`}</Text>
                    <Text component="p">
                        <Label color="blue" icon={<GithubIcon />}>
                            {forge}
                        </Label>
                    </Text>
                </TextContent>
            </PageSection>

            <PageSection>
                <Card>
                    <CardBody>
                        <Tabs
                            isFilled
                            activeKey={activeTabKey}
                            onSelect={handleTabClick}
                            isBox={true}
                        >
                            <Tab
                                eventKey={0}
                                title={<TabTitleText>PRs Handled</TabTitleText>}
                            >
                                <PullRequestList
                                    repoName={repoName}
                                    namespace={namespace}
                                    forge={forge}
                                />
                            </Tab>
                            <Tab
                                eventKey={1}
                                title={
                                    <TabTitleText>
                                        Releases Handled
                                    </TabTitleText>
                                }
                            >
                                <ReleasesList
                                    repoName={repoName}
                                    namespace={namespace}
                                    forge={forge}
                                />
                            </Tab>
                            <Tab
                                eventKey={2}
                                title={
                                    <TabTitleText>
                                        Branches Handled
                                    </TabTitleText>
                                }
                            >
                                <BranchList
                                    repoName={repoName}
                                    namespace={namespace}
                                    forge={forge}
                                />
                            </Tab>
                            <Tab
                                eventKey={3}
                                title={
                                    <TabTitleText>Issues Handled</TabTitleText>
                                }
                            >
                                <IssuesList
                                    repoName={repoName}
                                    namespace={namespace}
                                    forge={forge}
                                />
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </PageSection>
        </div>
    );
};
export { ProjectInfo };

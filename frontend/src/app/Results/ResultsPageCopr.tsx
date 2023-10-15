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

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { TriggerLink } from "../Trigger/TriggerLink";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { Timestamp } from "../utils/Timestamp";
import { useParams } from "react-router-dom";
import { useTitle } from "../utils/useTitle";
import { getCommitLink } from "../utils/forgeUrls";
import { useQuery } from "@tanstack/react-query";
import { ResultsPageCoprDetails } from "./ResultsPageCoprDetails";
import { SHACopy } from "../utils/SHACopy";

interface BuildPackage {
    arch: string;
    epoch: number;
    name: string;
    release: string;
    version: string;
}

export interface CoprResult {
    build_id: string;
    status: string;
    chroot: string;
    build_submitted_time: number;
    build_start_time: number;
    build_finished_time: number;
    commit_sha: string;
    web_url: string;
    build_logs_url: string;
    copr_project: string;
    copr_owner: string;
    srpm_build_id: number;
    run_ids: number[];
    built_packages: BuildPackage[];
    repo_namespace: string;
    repo_name: string;
    git_repo: string;
    pr_id: number | null;
    issue_id: number | null;
    branch_name: string | null;
    release: string | null;
}

function getPackagesToInstall(built_packages: BuildPackage[]) {
    let packagesToInstall = [];

    for (let packageDict of built_packages) {
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

export const fetchSyncRelease = (url: string) =>
    fetch(url).then((response) => {
        if (!response.ok && response.status !== 404) {
            throw Promise.reject(response);
        }
        return response.json();
    });

export const API_COPR_BUILDS = `${import.meta.env.VITE_API_URL}/copr-builds/`;

const ResultsPageCopr = () => {
    useTitle("Copr Results");
    let { id } = useParams();
    const URL = API_COPR_BUILDS + id;

    const { data, isError, isInitialLoading } = useQuery<
        CoprResult | { error: string }
    >([URL], () => fetchSyncRelease(URL));

    // If backend API is down
    if (isError) {
        return <ErrorConnection />;
    }

    // Show preloader if waiting for API data
    if (isInitialLoading || data === undefined) {
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
                            <TriggerLink builds={data} />
                            <SHACopy
                                git_repo={data.git_repo}
                                commit_sha={data.commit_sha}
                            />
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
                                You can install the built RPMs by following
                                these steps:
                            </strong>
                        </Text>
                        <br />
                        <List>
                            <ListItem>
                                <code>
                                    sudo yum install -y dnf-plugins-core
                                </code>{" "}
                                on RHEL 8 or CentOS Stream
                            </ListItem>
                            <ListItem>
                                <code>
                                    sudo dnf install -y dnf-plugins-core
                                </code>{" "}
                                on Fedora
                            </ListItem>
                            <ListItem>
                                <code>
                                    sudo dnf copr enable {data.copr_owner}/
                                    {data.copr_project}
                                </code>
                            </ListItem>
                            {data.built_packages ? (
                                <ListItem>
                                    <code>
                                        sudo dnf install -y{" "}
                                        {getPackagesToInstall(
                                            data.built_packages,
                                        ).join(" ")}
                                    </code>
                                </ListItem>
                            ) : (
                                <></>
                            )}
                        </List>
                        <Text component="p">
                            <br />
                            Please note that the RPMs should be used only in a
                            testing environment.
                        </Text>
                    </CardBody>
                </Card>
            </PageSection>
        </>
    );
};

export { ResultsPageCopr };

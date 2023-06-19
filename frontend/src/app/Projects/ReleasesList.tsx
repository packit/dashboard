import React from "react";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { useQuery } from "@tanstack/react-query";
import { getReleaseLink, getCommitLink } from "../utils/forgeUrls";

// Fetch data from dashboard backend (or if we want, directly from the API)
async function fetchData(URL: string): Promise<ProjectRelease[]> {
    return fetch(URL).then((response) => response.json());
}

interface ProjectRelease {
    commit_hash: string;
    tag_name: string;
}

interface ReleasesListProps {
    forge: string;
    namespace: string;
    repoName: string;
}

const ReleasesList: React.FC<ReleasesListProps> = ({
    forge,
    namespace,
    repoName,
}) => {
    const URL = `${
        import.meta.env.VITE_API_URL
    }/projects/${forge}/${namespace}/${repoName}/releases`;
    const { data, isError, isInitialLoading } = useQuery([URL], () =>
        fetchData(URL),
    );

    // If backend API is down
    if (isError) {
        return <ErrorConnection />;
    }

    // Show preloader if waiting for API data
    if (isInitialLoading) {
        return <Preloader />;
    }

    return (
        <table
            className="pf-c-table pf-m-compact pf-m-grid-md"
            role="grid"
            aria-label="Testing Farm Results Table"
        >
            <thead>
                <tr role="row">
                    <th role="columnheader" scope="col">
                        Tag
                    </th>
                    <th role="columnheader" scope="col">
                        Commit Hash
                    </th>
                </tr>
            </thead>
            <tbody>
                {data?.map((release, index) => (
                    <tr role="row" key={index}>
                        <td role="cell" data-label="Tag">
                            <a
                                href={getReleaseLink(
                                    `https://${forge}/${namespace}/${repoName}`,
                                    release.tag_name,
                                )}
                                rel="noreferrer"
                                target="_blank"
                            >
                                {release.tag_name}
                            </a>
                        </td>
                        <td role="cell" data-label="Commit Hash">
                            <a
                                href={getCommitLink(
                                    `https://${forge}/${namespace}/${repoName}`,
                                    release.commit_hash,
                                )}
                                rel="noreferrer"
                                target="_blank"
                            >
                                {release.commit_hash}
                            </a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export { ReleasesList };

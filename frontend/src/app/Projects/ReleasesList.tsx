import React from "react";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";
import { useQuery } from "react-query";

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
    const URL = `${process.env.REACT_APP_API_URL}/projects/${forge}/${namespace}/${repoName}/releases`;
    const { data, isError, isLoading } = useQuery([URL], () => fetchData(URL));

    // If backend API is down
    if (isError) {
        return <ErrorConnection />;
    }

    // Show preloader if waiting for API data
    if (isLoading) {
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
                            {release.tag_name}
                        </td>
                        <td role="cell" data-label="Commit Hash">
                            {release.commit_hash}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export { ReleasesList };

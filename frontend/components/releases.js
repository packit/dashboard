import React, { useState, useEffect } from "react";

import ConnectionError from "./error";
import Preloader from "./preloader";

import { List, ListItem } from "@patternfly/react-core";

const ReleasesList = (props) => {
    // Local State
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [releaseList, setReleaseList] = useState([]);

    // PR Info
    const forge = props.forge;
    const namespace = props.namespace;
    const repoName = props.repoName;

    // Fetch data from dashboard backend (or if we want, directly from the API)
    function fetchData() {
        fetch(`/api/projects/${forge}/${namespace}/${repoName}/releases`)
            .then((response) => response.json())
            .then((data) => {
                setReleaseList(data);
                setLoaded(true);
            })
            .catch((err) => {
                console.log(err);
                setErrors(err);
            });
    }

    // Executes fetchData on first render of component
    // look at detailed comment in ./copr_builds_table.js
    useEffect(() => {
        fetchData();
    }, []);

    // If backend API is down
    if (hasError) {
        return <ConnectionError />;
    }

    // Show preloader if waiting for API data
    if (!loaded) {
        return <Preloader />;
    }

    return (
        <div>
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
                <tbody role="rowgroup">
                    {releaseList.map((release, index) => (
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
        </div>
    );
};

export default ReleasesList;

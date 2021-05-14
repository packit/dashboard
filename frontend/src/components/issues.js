import React, { useState, useEffect } from "react";

import ConnectionError from "./error";
import Preloader from "./preloader";

import { List, ListItem } from "@patternfly/react-core";

const IssuesList = (props) => {
    // Local State
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [issueList, setIssueList] = useState([]);

    // PR Info
    const forge = props.forge;
    const namespace = props.namespace;
    const repoName = props.repoName;

    // Fetch data from dashboard backend (or if we want, directly from the API)
    function fetchData() {
        fetch(
            `${process.env.REACT_APP_API_URL}/projects/${forge}/${namespace}/${repoName}/issues`
        )
            .then((response) => response.json())
            .then((data) => {
                setIssueList(data);
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

    // Don't know why Patternfly had to make react components for bullet lists 🤔
    // Unnecessary abstraction...but I guess it saves you from adding more classes so whatever
    return (
        <div>
            <List>
                {issueList.map((issue, index) => (
                    <ListItem key={index}>#{issue}</ListItem>
                ))}
            </List>
        </div>
    );
};

export default IssuesList;

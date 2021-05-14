import React, { useState, useEffect } from "react";

import ConnectionError from "./error";
import Preloader from "./preloader";
import TriggerInfo from "./trigger_info";

import {
    Button,
    DataList,
    DataListToggle,
    DataListCell,
    DataListItem,
    DataListContent,
    DataListItemCells,
    DataListItemRow,
} from "@patternfly/react-core";

const PullRequestList = (props) => {
    // Local State
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState({});
    const [prList, setPRList] = useState([]);

    // PR Info
    const forge = props.forge;
    const namespace = props.namespace;
    const repoName = props.repoName;

    // Fetch data from dashboard backend (or if we want, directly from the API)
    function fetchData() {
        fetch(
            `${process.env.REACT_APP_API_URL}/projects/${forge}/${namespace}/${repoName}/prs?page=${page}&per_page=10`
        )
            .then((response) => response.json())
            .then((data) => {
                setPRList(prList.concat(data));
                setLoaded(true);
                setPage(page + 1); // set next page
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

    function onToggle(prID) {
        // We cant just invert the previous state here
        // because its undefined for the first time
        if (expanded[prID]) {
            let copyExpanded = { ...expanded };
            copyExpanded[prID] = false;
            setExpanded(copyExpanded);
        } else {
            let copyExpanded = { ...expanded };
            copyExpanded[prID] = true;
            setExpanded(copyExpanded);
        }
    }

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
            <DataList aria-label="PR List" isCompact>
                {prList.map((pr, index) => (
                    <DataListItem
                        aria-labelledby="PR List Item"
                        key={index}
                        isExpanded={expanded[pr.pr_id]}
                    >
                        <DataListItemRow>
                            <DataListToggle
                                onClick={() => onToggle(pr.pr_id)}
                                isExpanded={expanded[pr.pr_id]}
                                id={`pull-request-${pr.pr_id}`}
                                aria-controls="ex-expand1"
                            />
                            <DataListItemCells
                                dataListCells={[
                                    <DataListCell key="data-list-title-pr">
                                        <div>#{pr.pr_id}</div>
                                    </DataListCell>,
                                ]}
                            />
                        </DataListItemRow>
                        <DataListContent
                            aria-label="PR Content"
                            id="ex-expand1"
                            isHidden={!expanded[pr.pr_id]}
                        >
                            <TriggerInfo trigger={pr} />
                        </DataListContent>
                    </DataListItem>
                ))}
            </DataList>
            <center>
                <br />
                <Button variant="control" onClick={fetchData}>
                    Load More
                </Button>
            </center>
        </div>
    );
};

export default PullRequestList;

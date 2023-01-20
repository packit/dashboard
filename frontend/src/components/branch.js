import React, { useState, useEffect } from "react";

import ConnectionError from "./error";
import Preloader from "./preloader";
import TriggerInfo from "./trigger_info";

import {
    DataList,
    DataListToggle,
    DataListCell,
    DataListItem,
    DataListContent,
    DataListItemCells,
    DataListItemRow,
} from "@patternfly/react-core";

const BranchList = (props) => {
    // Local State
    const [hasError, setErrors] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [branchList, setBranchList] = useState([]);

    // Repo Info
    const forge = props.forge;
    const namespace = props.namespace;
    const repoName = props.repoName;

    // Fetch data from dashboard backend (or if we want, directly from the API)
    function fetchData() {
        fetch(
            `${process.env.REACT_APP_API_URL}/projects/${forge}/${namespace}/${repoName}/branches`
        )
            .then((response) => response.json())
            .then((data) => {
                setBranchList(branchList.concat(data));
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onToggle(branchName) {
        // We cant just invert the previous state here
        // because its undefined for the first time
        if (expanded[branchName]) {
            let copyExpanded = { ...expanded };
            copyExpanded[branchName] = false;
            setExpanded(copyExpanded);
        } else {
            let copyExpanded = { ...expanded };
            copyExpanded[branchName] = true;
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
            <DataList aria-label="Branch List" isCompact>
                {branchList.map((branch, index) => (
                    <DataListItem
                        aria-labelledby="Branch List Item"
                        key={index}
                        isExpanded={expanded[branch.branch]}
                    >
                        <DataListItemRow>
                            <DataListToggle
                                onClick={() => onToggle(branch.branch)}
                                isExpanded={expanded[branch.branch]}
                                id={`branch-${branch.branch}`}
                                aria-controls="ex-expand1"
                            />
                            <DataListItemCells
                                dataListCells={[
                                    <DataListCell key="Branch Name">
                                        <div>#{branch.branch}</div>
                                    </DataListCell>,
                                ]}
                            />
                        </DataListItemRow>
                        <DataListContent
                            aria-label="Branch Content"
                            id="ex-expand1"
                            isHidden={!expanded[branch.branch]}
                        >
                            <TriggerInfo trigger={branch} />
                        </DataListContent>
                    </DataListItem>
                ))}
            </DataList>
        </div>
    );
};

export default BranchList;

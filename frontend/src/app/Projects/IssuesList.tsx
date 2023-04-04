import React from "react";

import { ErrorConnection } from "../Errors/ErrorConnection";
import { Preloader } from "../Preloader/Preloader";

import { List, ListItem } from "@patternfly/react-core";
import { useQuery } from "react-query";

const fetchData = (url: string) => {
    return fetch(url).then((response) => response.json());
};

interface IssuesListProps {
    forge: string;
    namespace: string;
    repoName: string;
}
const IssuesList: React.FC<IssuesListProps> = ({
    forge,
    namespace,
    repoName,
}) => {
    const URL = `${
        import.meta.env.VITE_API_URL
    }/projects/${forge}/${namespace}/${repoName}/issues`;
    // TODO: Setup interface or type for issues endpoint
    const { data, isLoading, isError } = useQuery<string[]>([URL], () =>
        fetchData(URL),
    );

    // If backend API is down
    if (isError) {
        return <ErrorConnection />;
    }

    // Show preloader if waiting for API data
    if (isLoading) {
        return <Preloader />;
    }

    return (
        <List>
            {data?.map((issue) => <ListItem key={issue}>#{issue}</ListItem>)}
        </List>
    );
};

export { IssuesList };

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { LogViewer } from "@patternfly/react-log-viewer";
import { useQuery } from "@tanstack/react-query";
import { fetchLog } from "./TestingFarmPoC";

export const TestcaseLog: React.FC<{ testCase: Element }> = ({ testCase }) => {
  const logs = Array.from(testCase.querySelectorAll("logs > log"));
  const logToDisplay = logs
    .find((log) => log.getAttribute("name")?.endsWith("testout.log"))
    ?.getAttribute("href");

  const { data, isInitialLoading } = useQuery([logToDisplay], () =>
    logToDisplay ? fetchLog(logToDisplay) : "",
  );

  if (isInitialLoading) {
    return <Preloader />;
  }

  return <LogViewer theme="dark" data={data} />;
};

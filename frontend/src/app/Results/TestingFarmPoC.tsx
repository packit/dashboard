// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import { Tab, TabTitleText, Tabs } from "@patternfly/react-core";
import { LogViewer } from "@patternfly/react-log-viewer";
import { useQuery } from "@tanstack/react-query";
import { name } from "ejs";
import { useMemo, useState } from "react";
import { Preloader } from "../Preloader/Preloader";

const fetchTestingFarm = (url: string): Promise<unknown> =>
  fetch(url).then((response) => {
    if (!response.ok && response.status !== 404) {
      throw Promise.reject(response);
    }
    return response.json();
  });

interface TestingFarmPoCProps {
  url: string;
}
export const TestingFarmPoC: React.FC<TestingFarmPoCProps> = ({ url }) => {
  const { data, isError, isInitialLoading } = useQuery<any>([url], () =>
    fetchTestingFarm(url),
  );
  if (isInitialLoading) {
    return <>Loading</>;
  }
  const xunit = new DOMParser().parseFromString(data.result.xunit, "text/xml");
  console.log(xunit);
  console.log(xunit.getElementsByTagName("testsuites"));
  const testsuitesDom = Array.from(xunit.getElementsByTagName("testsuites"));
  const testsuiteDom = Array.from(
    testsuitesDom[0].getElementsByTagName("testsuite"),
  ); //.map(testSuite => <>test</>)
  console.log(testsuiteDom);
  return (
    <>
      Overall status: {testsuitesDom[0].getAttribute("overall-result")}
      <TestSuiteTabs testSuitesDom={testsuitesDom}></TestSuiteTabs>
    </>
  );
};

const TestSuiteTabs: React.FC<{ testSuitesDom: Element[] }> = ({
  testSuitesDom,
}) => {
  const [activeKey, setActiveKey] = useState<string | number>(0); // Toggle currently active tab
  const handleTabClick = (
    event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number,
  ) => {
    setActiveKey(tabIndex);
  };
  const t = testSuitesDom.map((testSuite, i) => {
    const testsuiteTabs = Array.from(
      testSuite.getElementsByTagName("testsuite"),
    ).map((testSuite, j) => testSuiteTab(j, testSuite));
    return (
      <Tabs key={i} isBox onSelect={handleTabClick} activeKey={activeKey}>
        {testsuiteTabs}
      </Tabs>
    );
  });
  return <>{t}</>;
};

const testSuiteTab = (eventKey: string | number, testSuiteDom: Element) => {
  const testcases = Array.from(testSuiteDom.getElementsByTagName("testcase"));
  return (
    <Tab
      key={eventKey}
      eventKey={eventKey}
      title={
        <TabTitleText role="region">
          {testSuiteDom.getAttribute("name")} -{" "}
          {testSuiteDom.getAttribute("result")}
        </TabTitleText>
      }
    >
      <Tabs isSecondary activeKey={0}>
        {testcases.map((testcase, i) => (
          <Tab
            key={i}
            eventKey={i}
            title={
              <TabTitleText>
                {testcase.getAttribute("name")} -{" "}
                {testSuiteDom.getAttribute("result")}
              </TabTitleText>
            }
          >
            <TestcaseLog testCase={testcase} />
          </Tab>
        ))}
      </Tabs>
    </Tab>
  );
};

const fetchLog = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok && response.status !== 404) {
    throw Promise.reject(response);
  }
  return await response.text();
};

const TestcaseLog: React.FC<{ testCase: Element }> = ({ testCase }) => {
  const logs = Array.from(testCase.querySelectorAll("logs > log"));
  const logToDisplay = logs
    .find((log) => log.getAttribute("name")?.endsWith("testout.log"))
    ?.getAttribute("href");

  console.log("logToDisplay", logToDisplay);
  const { data, isInitialLoading } = useQuery({
    queryKey: [logToDisplay],
    queryFn: () => (logToDisplay ? fetchLog(logToDisplay) : ""),
    enabled: !!logToDisplay,
  });

  if (isInitialLoading) {
    return <Preloader />;
  }

  return <LogViewer theme="dark" data={data} />;
};

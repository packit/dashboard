// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

import React, { memo, ReactElement, useEffect, useMemo, useState } from "react";

import {
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { SkeletonTable } from "@patternfly/react-component-groups";
import { LabelGroup } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PipelineRun } from "../../apiDefinitions";
import { pipelinesQueryOptions } from "../../queries/pipeline/pipelinesQuery";
import coprLogo from "../../static/copr.ico";
import kojiLogo from "../../static/koji.ico";
import { ErrorConnection } from "../errors/ErrorConnection";
import { ForgeIcon, ForgeIconByForge } from "../icons/ForgeIcon";
import { PackitPagination } from "../shared/PackitPagination";
import { PackitPaginationContext } from "../shared/PackitPaginationContext";
import { Timestamp } from "../shared/Timestamp";
import { StatusLabel } from "../statusLabels/StatusLabel";
import { SyncReleaseTargetStatusLabel } from "../statusLabels/SyncReleaseTargetStatusLabel";
import { TriggerLink, TriggerSuffix } from "../trigger/TriggerLink";

interface StatusItem {
  packit_id: number;
  status?: string;
  target: string;
}

interface StatusItemSRPM {
  packit_id: number;
  status: string;
  target?: string;
}

interface StatusesProps {
  route: string;
  name: string | React.ReactNode;
  entries: (StatusItem | StatusItemSRPM)[];
  statusClass: typeof StatusLabel;
}

const Statuses: React.FC<StatusesProps> = (props) => {
  const labels = useMemo(() => {
    const labelled: React.ReactNode[] = [];
    props.entries.forEach((entry, _i) => {
      labelled.push(
        <props.statusClass
          key={`/jobs/${props.route}/${entry.packit_id}`}
          status={entry.status ?? entry.target!}
          target={entry.target}
          link={`/jobs/${props.route}/${entry.packit_id}`}
        />,
      );
    });
    return labelled;
  }, [props]);

  // Technically LabelGroup doesn't accept elements, only string. But the way it currently uses them works for us
  // Should be tested as part of a visual test
  return <LabelGroup categoryName={props.name as string}>{labels}</LabelGroup>;
};

const iconStyle = {
  minWidth: "14px",
  minHeight: "14px",
  width: "14px",
  height: "14px",
};
function getBuilderLabel(run: PipelineRun) {
  const [text, setText] = useState("none");
  const [icon, setIcon] = useState<ReactElement>();

  useEffect(() => {
    if (run.copr.length > 0) {
      setIcon(<img style={iconStyle} src={coprLogo} alt="Copr logo" />);
      setText("Copr");
    } else if (run.koji.length > 0) {
      setIcon(<img style={iconStyle} src={kojiLogo} alt="Koji logo" />);
      setText("Koji");
    }
  }, [run.copr, run.koji]);

  return (
    <>
      {icon}&nbsp;<span>{text}</span>
    </>
  );
}
// Headings
const columnNames = {
  trigger: "Trigger",
  timeSubmitted: "Time Submitted",
  jobs: "Jobs",
  external: "External",
};
export function PipelinesTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const value = { page, setPage, perPage, setPerPage };

  const { isLoading, isError, data } = useQuery(
    pipelinesQueryOptions(page, perPage),
  );

  const mappedRows = useMemo(
    () =>
      data
        ?.filter((run) => run.trigger)
        .map((run) => <PipelinesTableTr key={run.merged_run_id} run={run} />),
    [columnNames, data],
  );

  const TableHeads = [
    <Th key={columnNames.trigger} width={20}>
      {columnNames.trigger}
    </Th>,
    <Th key={columnNames.timeSubmitted} width={10}>
      {columnNames.timeSubmitted}
    </Th>,
    <Th key={columnNames.jobs} width={60}>
      {columnNames.jobs}
    </Th>,
    <Th key={columnNames.external}>{columnNames.external}</Th>,
  ];

  // If backend API is down
  if (isError) {
    return <ErrorConnection />;
  }

  return (
    <PackitPaginationContext.Provider value={value}>
      <PackitPagination />
      {isLoading ? (
        <SkeletonTable
          variant={TableVariant.compact}
          rows={perPage}
          columns={TableHeads}
        />
      ) : (
        <Table aria-label="Pipeline runs" variant={TableVariant.compact}>
          <Thead>
            <Tr>{TableHeads}</Tr>
          </Thead>
          <Tbody>{mappedRows}</Tbody>
        </Table>
      )}
    </PackitPaginationContext.Provider>
  );
}

interface PipelinesTableTrProps {
  run: PipelineRun;
}

const PipelinesTableTr = memo(function PipelinesTableTr({
  run,
}: PipelinesTableTrProps) {
  return (
    <Tr key={run.merged_run_id}>
      <Td dataLabel={columnNames.trigger}>
        <strong>
          {"project_url" in run.trigger ? (
            <ForgeIcon url={run.trigger.project_url} />
          ) : (
            <ForgeIconByForge />
          )}{" "}
          <Link to={`/pipeline/${run.merged_run_id}`}>
            {"project_url" in run.trigger ? (
              <>
                <TriggerSuffix trigger={run.trigger} />
              </>
            ) : (
              <>{run.merged_run_id}</>
            )}
          </Link>
        </strong>
      </Td>
      <Td dataLabel={columnNames.timeSubmitted}>
        <Timestamp stamp={run.time_submitted} />
      </Td>
      <Td dataLabel={columnNames.jobs}>
        <>
          <Statuses
            name={"SRPM"}
            route={"srpm-builds"}
            statusClass={StatusLabel}
            entries={run.srpm ? [run.srpm] : []}
          />
          <Statuses
            name={getBuilderLabel(run)}
            route={"copr-builds"}
            statusClass={StatusLabel}
            entries={run.copr}
          />
          <Statuses
            name={getBuilderLabel(run)}
            route={"koji-builds"}
            statusClass={StatusLabel}
            entries={run.koji}
          />
          <Statuses
            name={"Testing Farm"}
            route={"testing-farm"}
            statusClass={StatusLabel}
            entries={run.test_run}
          />
          <Statuses
            name={"Propose Downstream"}
            route={"propose-downstream"}
            statusClass={SyncReleaseTargetStatusLabel}
            entries={run.propose_downstream}
          />
          <Statuses
            name={"Pull From Upstream"}
            route={"pull-from-upstream"}
            statusClass={SyncReleaseTargetStatusLabel}
            entries={run.pull_from_upstream}
          />
          <Statuses
            name={"Bodhi Updates"}
            route={"bodhi-updates"}
            statusClass={StatusLabel}
            entries={run.bodhi_update}
          />
        </>
      </Td>
      <Td dataLabel={columnNames.external}>
        <TriggerLink trigger={run.trigger}>
          <ExternalLinkAltIcon />
        </TriggerLink>
      </Td>
    </Tr>
  );
});

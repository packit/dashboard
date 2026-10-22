// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT
import { test } from "vitest";
import { getTestingFarmResultsUrl } from "./testingFarmUrls";

const pipelineId = "b3a1c9f0-1d2e-4f5a-8b7c-6d5e4f3a2b1c";

test("results URL prefers the reported web URL", ({ expect }) => {
  expect(
    getTestingFarmResultsUrl({
      pipeline_id: pipelineId,
      web_url: `https://artifacts.dev.testing-farm.io/${pipelineId}`,
    }),
  ).toBe(`https://artifacts.dev.testing-farm.io/${pipelineId}`);
});

test("results URL falls back to the Testing Farm API", ({ expect }) => {
  expect(
    getTestingFarmResultsUrl({ pipeline_id: pipelineId, web_url: null }),
  ).toBe(`https://api.dev.testing-farm.io/v0.1/requests/${pipelineId}`);
});

test("results URL is missing for a run not submitted yet", ({ expect }) => {
  expect(
    getTestingFarmResultsUrl({ pipeline_id: null, web_url: null }),
  ).toBeNull();
});

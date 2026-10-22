// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

// Same instance packit-service submits the requests to
const TESTING_FARM_API_URL = "https://api.dev.testing-farm.io/v0.1";

interface TestingFarmRunUrls {
  pipeline_id: string | null;
  web_url: string | null;
}

/**
 * Returns the URL with the results of the Testing Farm run.
 *
 * Packit receives the results URL only once Testing Farm reports back, until
 * then point to the Testing Farm API, which shows the current state of the
 * request.
 */
export const getTestingFarmResultsUrl = (run: TestingFarmRunUrls) => {
  if (run.web_url) {
    return run.web_url;
  }
  if (run.pipeline_id) {
    return `${TESTING_FARM_API_URL}/requests/${run.pipeline_id}`;
  }
  return null;
};

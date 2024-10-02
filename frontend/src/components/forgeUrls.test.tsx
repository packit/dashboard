// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT
import { test, vi } from "vitest";
import { getHostName } from "./forgeUrls";

test("hostname logs error for invalid URL", ({ expect }) => {
  const consoleMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);
  expect(getHostName("invalid url")).toBe("");

  expect(consoleMock.mock.lastCall?.[0].toString()).toContain("Invalid URL");
  expect(consoleMock.mock.lastCall?.[0]).toBeInstanceOf(TypeError);
});

// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT
import { assertType, test, vi } from "vitest";
import { getHostName } from "./forgeUrls";

test("can get hostname from string", ({ expect }) => {
  expect(getHostName("https://example.com?foo=bar")).toBe("example.com");
});

test("can get hostname from URL instance", ({ expect }) => {
  const host = new URL("https://example.com");
  expect(getHostName(host)).toBe("example.com");
});

test("hostname logs error for invalid URL", ({ expect }) => {
  const consoleMock = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);
  expect(getHostName("invalid url")).toBe("");

  expect(consoleMock.mock.lastCall?.[0].toString()).toContain("Invalid URL");
  expect(consoleMock.mock.lastCall?.[0]).toBeInstanceOf(TypeError);
});

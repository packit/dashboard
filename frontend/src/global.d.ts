// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string?;
  readonly VITE_GIT_SHA: string?;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export * from "@tanstack/react-router";
declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    title: string;
  }
}

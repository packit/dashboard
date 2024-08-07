// Copyright Contributors to the Packit project.
// SPDX-License-Identifier: MIT

export function useTitle(title: string) {
  document.title = "Packit Service" + (title ? ` - ${title}` : "");
}

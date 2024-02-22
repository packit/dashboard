#!/usr/bin/env python3

# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

import datetime
import logging
import os
import sys

from ogr import GithubService


def main():
    if len(sys.argv) != 2:
        logging.error("Usage: notify domain")
        sys.exit(1)

    time = datetime.datetime.utcnow().strftime("%a %d %b %Y, %H:%M UTC")
    domain = sys.argv[1]

    service = GithubService(token=os.getenv("GH_PR_TOKEN"))
    owner, repo = (os.getenv("GITHUB_REPOSITORY") or "").split("/")
    pr_id = int(os.getenv("GH_PR_NUM"))

    project = service.get_project(namespace=owner, repo=repo)
    pr = project.get_pr(pr_id)
    comments = pr.get_comments(author=service.user.get_username())

    body = f"Preview: https://{domain} (deployed at {time})"

    if comments:
        comments[0].body = body
        logging.info("Updated existing comment")
        return

    pr.comment(body=body)
    logging.info("Created new comment")


if __name__ == "__main__":
    main()

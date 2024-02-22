# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

from os import getenv

deployment = getenv("DEPLOYMENT", "stg")

API_URL = f"https://{deployment}.packit.dev/api"

# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

from logging import getLogger

from flask import Blueprint
from flask_cors import CORS


logger = getLogger("packit_dashboard")
api = Blueprint(
    "api",
    __name__,
)
CORS(api)


@api.route("/api/", defaults={"path": ""})
@api.route("/api/<path:path>")
def drop(path):
    """
    Return ‹421› for all misdirected requests that reused / used persistent
    HTTP/2 connection with the wrong SNI and got routed via OpenShift to the
    dashboard rather than the actual Packit Service API endpoint.
    """
    return ("", 421)

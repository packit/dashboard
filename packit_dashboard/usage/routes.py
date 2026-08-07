# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

from logging import getLogger

from flask import Blueprint, jsonify, request

from packit_dashboard.config import API_URL
from packit_dashboard.usage.cache import get_cached_or_fetch

logger = getLogger("packit_dashboard")

usage = Blueprint("usage", __name__)


@usage.route("/api/usage/<granularity>")
def usage_by_granularity(granularity):
    try:
        data = get_cached_or_fetch(
            f"usage-{granularity}",
            f"{API_URL}/usage/{granularity}",
        )
        return jsonify(data)
    except Exception:
        logger.exception("Failed to fetch usage data for %s", granularity)
        return jsonify({"error": "Failed to fetch usage data"}), 502


@usage.route("/api/usage/intervals")
def usage_intervals():
    days = request.args.get("days", "")
    hours = request.args.get("hours", "")
    count = request.args.get("count", "")
    try:
        data = get_cached_or_fetch(
            f"usage-intervals-{days}-{hours}-{count}",
            f"{API_URL}/usage/intervals?days={days}&hours={hours}&count={count}",
        )
        return jsonify(data)
    except Exception:
        logger.exception("Failed to fetch usage intervals")
        return jsonify({"error": "Failed to fetch usage data"}), 502

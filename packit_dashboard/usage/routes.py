# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

import json
from datetime import date
from logging import getLogger
from pathlib import Path

import requests
from flask import Blueprint, jsonify, request

from packit_dashboard.config import API_URL

logger = getLogger("packit_dashboard")

usage = Blueprint("usage", __name__)

CACHE_DIR = Path("/tmp/packit-dashboard-usage-cache")


def _cache_path(cache_key: str) -> Path:
    today = date.today().isoformat()
    return CACHE_DIR / f"{cache_key}_{today}.json"


def _evict_stale():
    if not CACHE_DIR.exists():
        return
    today = date.today().isoformat()
    for f in CACHE_DIR.iterdir():
        if not f.name.endswith(f"_{today}.json"):
            f.unlink(missing_ok=True)


def _get_cached_or_fetch(cache_key: str, url: str) -> dict:
    path = _cache_path(cache_key)

    if path.exists():
        return json.loads(path.read_text())

    _evict_stale()

    response = requests.get(url, timeout=60)
    response.raise_for_status()
    data = response.json()

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data))
    return data


@usage.route("/api/usage/<granularity>")
def usage_by_granularity(granularity):
    try:
        data = _get_cached_or_fetch(
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
        data = _get_cached_or_fetch(
            f"usage-intervals-{days}-{hours}-{count}",
            f"{API_URL}/usage/intervals?days={days}&hours={hours}&count={count}",
        )
        return jsonify(data)
    except Exception:
        logger.exception("Failed to fetch usage intervals")
        return jsonify({"error": "Failed to fetch usage data"}), 502

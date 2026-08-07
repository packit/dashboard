# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

import json
from datetime import date
from pathlib import Path

import requests

CACHE_DIR = Path("/tmp/packit-dashboard-usage-cache")


def _cache_path(cache_key: str) -> Path:
    today = date.today().isoformat()
    return CACHE_DIR / f"{cache_key}_{today}.json"


def evict_stale():
    if not CACHE_DIR.exists():
        return
    today = date.today().isoformat()
    for f in CACHE_DIR.iterdir():
        if not f.name.endswith(f"_{today}.json"):
            f.unlink(missing_ok=True)


def get_cached_or_fetch(cache_key: str, url: str) -> dict:
    path = _cache_path(cache_key)

    if path.exists():
        return json.loads(path.read_text())

    evict_stale()

    response = requests.get(url, timeout=60)
    response.raise_for_status()
    data = response.json()

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data))
    return data

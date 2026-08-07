#!/usr/bin/env python3
# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

"""Pre-generate usage cache files. Run via cron at 00:01 daily."""

import logging
import sys

from packit_dashboard.config import API_URL
from packit_dashboard.usage.cache import evict_stale, get_cached_or_fetch

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("packit_dashboard")

GRANULARITIES = ["past-day", "past-week", "past-month", "past-year", "total"]
INTERVALS = [
    {"days": 0, "hours": 1, "count": 24},
    {"days": 1, "hours": 0, "count": 7},
    {"days": 1, "hours": 0, "count": 30},
    {"days": 7, "hours": 0, "count": 52},
]


def main():
    evict_stale()
    errors = 0

    for granularity in GRANULARITIES:
        try:
            get_cached_or_fetch(
                f"usage-{granularity}",
                f"{API_URL}/usage/{granularity}",
            )
            logger.info("Cached usage/%s", granularity)
        except Exception:
            logger.exception("Failed to fetch usage/%s", granularity)
            errors += 1

    for interval in INTERVALS:
        days, hours, count = interval["days"], interval["hours"], interval["count"]
        try:
            get_cached_or_fetch(
                f"usage-intervals-{days}-{hours}-{count}",
                f"{API_URL}/usage/intervals?days={days}&hours={hours}&count={count}",
            )
            logger.info(
                "Cached usage/intervals days=%s hours=%s count=%s", days, hours, count
            )
        except Exception:
            logger.exception(
                "Failed to fetch usage/intervals days=%s hours=%s count=%s",
                days,
                hours,
                count,
            )
            errors += 1

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()

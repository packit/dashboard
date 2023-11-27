# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

import os
from datetime import datetime, timedelta
from logging import getLogger
from pathlib import Path
from typing import Union

from cachetools.func import ttl_cache
from flask import Blueprint, request, escape, render_template, current_app
from flask_cors import CORS

import packit_dashboard
from packit_dashboard.config import API_URL
from packit_dashboard.utils import make_response

logger = getLogger("packit_dashboard")

api = Blueprint(
    "api",
    __name__,
    template_folder=str(Path(packit_dashboard.__file__).parent.parent / "files"),
)
CORS(api)

# The React frontend will request information here instead of fetching directly
# from the main API.
# This is because it will be easier to implement caching API requests here.
# (Flask-Caching etc.)
# However, if you want to do this client side, just delete these and use apiURL in JS


_CACHE_MAXSIZE = 100


__now = datetime.now()
_DATE_IN_THE_PAST = __now.replace(year=__now.year - 100)


@api.route("/api/copr-builds/")
def copr_builds():
    page = escape(request.args.get("page"))
    per_page = escape(request.args.get("per_page"))
    url = f"{API_URL}/copr-builds?page={page}&per_page={per_page}"
    return make_response(url)


@api.route("/api/testing-farm/")
def testing_farm():
    page = escape(request.args.get("page"))
    per_page = escape(request.args.get("per_page"))
    url = f"{API_URL}/testing-farm/results?page={page}&per_page={per_page}"
    return make_response(url)


@api.route("/api/projects/")
def projects():
    page = escape(request.args.get("page"))
    per_page = escape(request.args.get("per_page"))
    url = f"{API_URL}/projects?page={page}&per_page={per_page}"
    return make_response(url)


@api.route("/api/projects/<forge>/<namespace>/<repo_name>/prs/")
def project_prs(forge, namespace, repo_name):
    forge = escape(forge)
    namespace = escape(namespace)
    repo_name = escape(repo_name)
    page = escape(request.args.get("page"))
    per_page = escape(request.args.get("per_page"))
    url = f"{API_URL}/projects/{forge}/{namespace}/{repo_name}/prs?page={page}&per_page={per_page}"
    return make_response(url)


@api.route("/api/projects/<forge>/<namespace>/<repo_name>/releases/")
def project_releases(forge, namespace, repo_name):
    forge = escape(forge)
    namespace = escape(namespace)
    repo_name = escape(repo_name)
    url = f"{API_URL}/projects/{forge}/{namespace}/{repo_name}/releases"
    return make_response(url)


@api.route("/api/projects/<forge>/<namespace>/<repo_name>/issues/")
def project_issues(forge, namespace, repo_name):
    forge = escape(forge)
    namespace = escape(namespace)
    repo_name = escape(repo_name)
    url = f"{API_URL}/projects/{forge}/{namespace}/{repo_name}/issues"
    return make_response(url)


@api.route("/api/propose-downstream/")
def propose_downstream():
    page = escape(request.args.get("page"))
    per_page = escape(request.args.get("per_page"))
    url = f"{API_URL}/propose-downstream?page={page}&per_page={per_page}"
    return make_response(url)


def _get_usage_data_from_packit_api(usage_from=None, usage_to=None, top=5):
    url = f"{API_URL}/usage?top={top}"
    if usage_from:
        url += f"&from={usage_from}"
    if usage_to:
        url += f"&to={usage_to}"
    current_app.logger.debug(f"Calling usage endpoint: {url}")
    return make_response(url)


@api.route("/api/usage/past-day")
@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(hours=1).seconds)
def usage_past_day():
    yesterday_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    return _get_usage_data_from_packit_api(usage_from=yesterday_date)


@api.route("/api/usage/past-week")
@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(hours=1).seconds)
def usage_past_week():
    past_week_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    return _get_usage_data_from_packit_api(usage_from=past_week_date)


@api.route("/api/usage/past-month")
@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(days=1).seconds)
def usage_past_month():
    now = datetime.now()
    past_month_past_day = now.replace(day=1) - timedelta(days=1)
    past_month_date = now.replace(
        year=past_month_past_day.year, month=past_month_past_day.month
    ).strftime("%Y-%m-%d")
    return _get_usage_data_from_packit_api(usage_from=past_month_date)


@api.route("/api/usage/past-year")
@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(days=1).seconds)
def usage_past_year():
    now = datetime.now()
    past_year_date = now.replace(year=now.year - 1).strftime("%Y-%m-%d")
    return _get_usage_data_from_packit_api(usage_from=past_year_date)


@api.route("/api/usage/total")
@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(days=1).seconds)
def usage_total():
    past_date = _DATE_IN_THE_PAST.strftime("%Y-%m-%d")
    return _get_usage_data_from_packit_api(usage_from=past_date)


# format the chart needs is a list of {"x": "datetimelegend", "y": value}
CHART_DATA_TYPE = list[dict[str, Union[str, int]]]


@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(hours=1).seconds)
def _get_usage_interval_data(
    days: int, hours: int, count: int
) -> dict[str, Union[str, CHART_DATA_TYPE, dict[str, CHART_DATA_TYPE]]]:
    """
    :param days: number of days for the interval length
    :param hours: number of days for the interval length
    :param count: number of intervals
    :return: usage data for the COUNT number of intervals
      (delta is DAYS number of days and HOURS number of hours)
    """
    delta = timedelta(days=days, hours=hours)

    current_date = datetime.now()
    days_legend = []
    for _ in range(count):
        days_legend.append(current_date)
        current_date -= delta

    result_jobs: dict[str, CHART_DATA_TYPE] = {}
    result_jobs_project_count: dict[str, CHART_DATA_TYPE] = {}
    result_jobs_project_cumulative_count: dict[str, CHART_DATA_TYPE] = {}
    result_events: dict[str, CHART_DATA_TYPE] = {}
    result_active_projects: CHART_DATA_TYPE = []
    result_active_projects_cumulative: CHART_DATA_TYPE = []

    past_data = _get_usage_data_from_packit_api(
        usage_from=_DATE_IN_THE_PAST, usage_to=days_legend[-1], top=100000
    ).json
    cumulative_projects_past = set(
        past_data["active_projects"]["top_projects_by_events_handled"].keys()
    )
    cumulative_projects = cumulative_projects_past.copy()
    cumulative_projects_for_jobs_past = {
        job: set(data["top_projects_by_job_runs"].keys())
        for job, data in past_data["jobs"].items()
    }
    cumulative_projects_for_jobs = cumulative_projects_for_jobs_past.copy()

    for day in reversed(days_legend):
        day_from = (day - delta).isoformat()
        day_to = day.isoformat()
        legend = day.strftime("%H:%M" if (hours and not days) else "%Y-%m-%d")

        interval_result = _get_usage_data_from_packit_api(
            usage_from=day_from, usage_to=day_to, top=100000
        ).json

        for job, data in interval_result["jobs"].items():
            result_jobs.setdefault(job, [])
            result_jobs[job].append({"x": legend, "y": data["job_runs"]})
            result_jobs_project_count.setdefault(job, [])
            result_jobs_project_count[job].append(
                {"x": legend, "y": len(data["top_projects_by_job_runs"])}
            )

            cumulative_projects_for_jobs[job] |= data["top_projects_by_job_runs"].keys()
            result_jobs_project_cumulative_count.setdefault(job, [])
            result_jobs_project_cumulative_count[job].append(
                {"x": legend, "y": len(cumulative_projects_for_jobs[job])}
            )

        for event, data in interval_result["events"].items():
            result_events.setdefault(event, [])
            result_events[event].append({"x": legend, "y": data["events_handled"]})

        result_active_projects.append(
            {"x": legend, "y": interval_result["active_projects"].get("project_count")}
        )
        cumulative_projects |= interval_result["active_projects"][
            "top_projects_by_events_handled"
        ].keys()
        result_active_projects_cumulative.append(
            {"x": legend, "y": len(cumulative_projects)}
        )

    onboarded_projects_per_job = dict()
    for job, data in past_data["jobs"].items():
        onboarded_projects_per_job[job] = list(
            cumulative_projects_for_jobs[job] - cumulative_projects_for_jobs_past[job]
        )

    return {
        "jobs": result_jobs,
        "jobs_project_count": result_jobs_project_count,
        "jobs_project_cumulative_count": result_jobs_project_cumulative_count,
        "events": result_events,
        "from": days_legend[0].isoformat(),
        "to": days_legend[-1].isoformat(),
        "active_projects": result_active_projects,
        "active_projects_cumulative": result_active_projects_cumulative,
        "onboarded_projects": list(cumulative_projects - cumulative_projects_past),
        "onboarded_projects_per_job": onboarded_projects_per_job,
    }


@api.route("/api/usage/intervals")
def usage_intervals_past():
    """
    Returns the data for trend charts.

    Use `days` and `hours` parameters to define interval and `count` to set number of intervals.

    Examples:
    /api/usage/intervals/past?days=7&hours=0&count=52 for the weekly data of the last year
    /api/usage/intervals?days=0&hours=1&count=24 for the hourly data of the last day
    """
    count = int(escape(request.args.get("count", "10")))
    delta_hours = int(escape(request.args.get("hours", "0")))
    delta_days = int(escape(request.args.get("days", "0")))
    return _get_usage_interval_data(hours=delta_hours, days=delta_days, count=count)


@api.route("/api/images/architecture.svg")
def architecture_diagram():
    system_info = make_response(f"{API_URL}/system").json
    system_info["packit_dashboard"] = dict(commit=os.environ.get("VITE_GIT_SHA"))
    system_info["packit_worker"] = system_info["packit_service"]
    project_ref_mapping = {
        project.replace("-", "_") + "_ref": info.get("commit") or info.get("version")
        for project, info in system_info.items()
    }

    return render_template("architecture-red.svg", **project_ref_mapping)

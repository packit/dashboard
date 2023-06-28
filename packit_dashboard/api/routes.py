from datetime import datetime, timedelta

from cachetools.func import ttl_cache
from flask import Blueprint, request, escape
from flask_cors import CORS

from packit_dashboard.config import API_URL
from packit_dashboard.utils import make_response

api = Blueprint("api", __name__)
CORS(api)

# The React frontend will request information here instead of fetching directly
# from the main API.
# This is because it will be easier to implement caching API requests here.
# (Flask-Caching etc.)
# However, if you want to do this client side, just delete these and use apiURL in JS


_CACHE_MAXSIZE = 100


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

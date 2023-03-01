from flask import Blueprint, jsonify, request
from flask_cors import CORS
from packit_dashboard.utils import return_json
from packit_dashboard.config import API_URL
from datetime import datetime, timedelta
from cachetools.func import ttl_cache

api = Blueprint("api", __name__)
CORS(api)

# The react frontend will request information here instead of fetching directly
# from the main API.
# This is because it will be easier to implement caching API requests here.
# (Flask-Caching etc)
# However if you want to do this client side, just delete these and use apiURL in JS


_CACHE_MAXSIZE = 100


@api.route("/api/copr-builds/")
def copr_builds():
    page = request.args.get("page")
    per_page = request.args.get("per_page")
    url = f"{API_URL}/copr-builds?page={page}&per_page={per_page}"
    return jsonify(return_json(url))


@api.route("/api/testing-farm/")
def testing_farm():
    page = request.args.get("page")
    per_page = request.args.get("per_page")
    url = f"{API_URL}/testing-farm/results?page={page}&per_page={per_page}"
    return jsonify(return_json(url))


@api.route("/api/projects/")
def projects():
    page = request.args.get("page")
    per_page = request.args.get("per_page")
    url = f"{API_URL}/projects?page={page}&per_page={per_page}"
    return jsonify(return_json(url))


@api.route("/api/projects/<forge>/<namespace>/<repo_name>/prs/")
def project_prs(forge, namespace, repo_name):
    page = request.args.get("page")
    per_page = request.args.get("per_page")
    url = f"{API_URL}/projects/{forge}/{namespace}/{repo_name}/prs?page={page}&per_page={per_page}"
    return jsonify(return_json(url))


@api.route("/api/projects/<forge>/<namespace>/<repo_name>/releases/")
def project_releases(forge, namespace, repo_name):
    url = f"{API_URL}/projects/{forge}/{namespace}/{repo_name}/releases"
    return jsonify(return_json(url))


@api.route("/api/projects/<forge>/<namespace>/<repo_name>/issues/")
def project_issues(forge, namespace, repo_name):
    url = f"{API_URL}/projects/{forge}/{namespace}/{repo_name}/issues"
    return jsonify(return_json(url))


@api.route("/api/propose-downstream/")
def propose_downstream():
    page = request.args.get("page")
    per_page = request.args.get("per_page")
    url = f"{API_URL}/propose-downstream?page={page}&per_page={per_page}"
    return jsonify(return_json(url))


def _get_usage_data_from_packit_api(usage_from=None, usage_to=None, top=5):
    url = f"{API_URL}/usage?top={top}"
    if usage_from:
        url += f"&from={usage_from}"
    if usage_to:
        url += f"&to={usage_to}"
    result = jsonify(return_json(url))
    return result


@api.route("/api/usage/last-day")
@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(hours=1).seconds)
def usage_last_day():
    yesterday_date = (datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d")
    return _get_usage_data_from_packit_api(usage_from=yesterday_date)


@api.route("/api/usage/last-week")
@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(hours=1).seconds)
def usage_last_week():
    last_week_date = (datetime.today() - timedelta(days=7)).strftime("%Y-%m-%d")
    return _get_usage_data_from_packit_api(usage_from=last_week_date)


@api.route("/api/usage/last-month")
@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(days=1).seconds)
def usage_last_month():
    now = datetime.today()
    last_month_last_day = now.replace(day=1) - timedelta(days=1)
    last_month_date = now.replace(
        year=last_month_last_day.year, month=last_month_last_day.month
    ).strftime("%Y-%m-%d")
    return _get_usage_data_from_packit_api(usage_from=last_month_date)


@api.route("/api/usage/last-year")
@ttl_cache(maxsize=_CACHE_MAXSIZE, ttl=timedelta(days=1).seconds)
def usage_last_year():
    now = datetime.now()
    last_year_date = now.replace(year=now.year - 1).strftime("%Y-%m-%d")
    return _get_usage_data_from_packit_api(usage_from=last_year_date)

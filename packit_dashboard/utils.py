from flask import jsonify, Response as FlaskResponse
from requests import request, Response as RequestsResponse


""" Common utility functions used in multiple files in the packit_dashboard package. """


def make_response(url, method="GET", **kwargs) -> FlaskResponse:
    """Returns a response from URL

    :param url: API URL to request
    :param method: HTTP method
    :return: Flask Response
    """
    tries = 6
    for i in range(tries):
        try:
            req_response: RequestsResponse = request(method=method, url=url, **kwargs)
            response: FlaskResponse = jsonify(req_response.json())
        except Exception:
            if i < tries - 1:
                continue
            raise
        break

    return response

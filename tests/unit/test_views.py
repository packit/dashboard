# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

"""
Let's test flask views.
"""
import pytest
from packit_dashboard.app import app as application


@pytest.fixture
def client():
    application.config["TESTING"] = True
    # this affects all tests actually, heads up!
    application.config["SERVER_NAME"] = "localhost:5000"
    application.config["PREFERRED_URL_SCHEME"] = "https"

    with application.test_client() as client:
        yield client


@pytest.fixture(autouse=True)
def _setup_app_context_for_test():
    """
    Given app is session-wide, sets up a app context per test to ensure that
    app and request stack is not shared between tests.
    """
    ctx = application.app_context()
    ctx.push()
    yield  # tests will run here
    ctx.pop()


def test_architecture_image(client):
    response = client.get("/api/images/architecture.svg")
    assert response.status_code == 200

# Copyright Contributors to the Packit project.
# SPDX-License-Identifier: MIT

"""

from requre.storage import PersistentObjectStorage
from requre.utils import StorageMode
from requre import RequreTestCase

from packit_dashboard.packagewide_utils import return_json
from packit_dashboard.projects.utils import all_from


# Can be any json link that supports pagination, not necessarily packit's.
API_URL = "https://stg.packit.dev/api/tasks"


class TestUtilsUsingRequre(RequreTestCase):
    def setUp(self):
        super().setUp()

        if PersistentObjectStorage().mode == StorageMode.write:
            # Placeholder for whenever we wanna check if requre is in write/record mode
            # Can be used to initialize api keys, etc
            pass

        # Other pre-tests setup code

    # NOTE: If you delete tests_data to run requre it in write/record mode,
    # you will have to modify the assertions below accordingly

    # It should return a json object from a given url.

    def test_return_json(self):
        tasks_list = return_json(API_URL)
        # Returns 10 items by default
        assert len(tasks_list) == 10
        # Check if its iterable and parsable
        assert tasks_list[0]["date_done"] == "2020-03-13T18:55:15.493578"
        assert tasks_list[0]["status"] == "SUCCESS"
        assert tasks_list[0]["task_id"] == "e16a0972-4003-42de-a6ca-c73e9426d278"
        assert tasks_list[9]["date_done"] == "2020-03-13T12:49:44.092613"
        assert tasks_list[9]["status"] == "SUCCESS"
        assert tasks_list[9]["task_id"] == "c93e97ff-da3d-4d4e-9e6a-6ea9bb2702ca"



    # This test was disabled because
    # a) right now this function isnt being used anywhere
    # b) not sure if it should be used because fetching 1000 entries but displaying
    # only 20 seems inefficient
    # c) requre wants to recreate this, it would require a example API with paginatiion
    # and the example I used previously would now lead to a huge file with
    # like a hundred thousand lines


    # Should return one huge json after combining all pages
    def test_all_from(self):
        tasks_list = list(all_from(API_URL))
        # if its working properly then length of list will be way greater than 50
        # (35 pages and 50 items per page)
        assert len(tasks_list) > 100
        # Check if its iterable and parsable
        assert tasks_list[0]["date_done"] == "2020-03-13T18:55:15.493578"
        assert tasks_list[0]["status"] == "SUCCESS"
        assert tasks_list[0]["task_id"] == "e16a0972-4003-42de-a6ca-c73e9426d278"
        # Check some random object thats definitely not on the first page
        assert tasks_list[165]["date_done"] == "2020-03-13T15:39:08.924273"
        assert tasks_list[165]["status"] == "SUCCESS"
        assert tasks_list[165]["task_id"] == "c09dfbda-8dea-4a09-bd17-4a0fd7c292b1"


"""

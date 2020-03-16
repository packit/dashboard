from requre.helpers.requests_response import RequestResponseHandling
from requre.import_system import upgrade_import_system

dashboard_import_system = (
    upgrade_import_system(debug_file="modules.out")
    .log_imports(what="^requests$", who_name=["packit_dashboard"])
    .decorate(
        where="^requests$",
        what="Session.send",
        who_name=["packit_dashboard"],
        decorator=RequestResponseHandling.decorator(item_list=[]),
    )
)


# NOTE:
# To run tests in write mode, delete the test_data folder.
# requre will then run the to-be-tested functions properly
# and store the output from  all 'requests' called within the
# function to a yaml file in test_data
# When you run the tests again, it will run them in read mode.

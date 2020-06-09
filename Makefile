CURDIR := ${CURDIR}
IMAGE ?= usercont/packit-dashboard:stg
TEST_IMAGE ?= packit-dashboard-tests
TEST_TARGET ?= ./tests/
CONTAINER_ENGINE ?= $(shell command -v podman 2> /dev/null || echo docker)

install-dependencies:
	sudo dnf -y install python3-flask yarnpkg
	yarn install

transpile-prod:
	yarn webpack --mode production --optimize-minimize

run-dev:
	yarn webpack --mode development --watch & FLASK_ENV=development FLASK_APP=packit_dashboard.app flask-3 run --host=0.0.0.0

run-container-stg: build-stg
	$(CONTAINER_ENGINE) run -p 8443:8443 -v $(CURDIR)/secrets:/secrets:z -i $(IMAGE)

build-stg:
	$(CONTAINER_ENGINE) build --rm -t $(IMAGE) -f Dockerfile .

push-stg: build-stg
	$(CONTAINER_ENGINE) push $(IMAGE)

oc-push-stg:
	oc import-image is/packit-dashboard:stg

check:
	PYTHONPATH=$(CURDIR) PYTHONDONTWRITEBYTECODE=1 python3 -m pytest --color=yes --verbose --showlocals --cov=packit_dashboard --cov-report=term-missing $(TEST_TARGET)

test_image: files/ansible/install-deps.yaml files/ansible/recipe-tests.yaml
	$(CONTAINER_ENGINE) build --rm -t $(TEST_IMAGE) -f Dockerfile.tests .

check_in_container: test_image
	$(CONTAINER_ENGINE) run --rm \
		--security-opt label=disable \
		$(TEST_IMAGE) make check

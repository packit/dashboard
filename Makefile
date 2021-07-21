CURDIR := ${CURDIR}
IMAGE ?= quay.io/packit/dashboard:stg
TEST_IMAGE ?= packit-dashboard-tests
TEST_TARGET ?= ./tests/
CONTAINER_ENGINE ?= $(shell command -v podman 2> /dev/null || echo docker)
API_STG = "https://stg.packit.dev/api"

install-dependencies: install-logos
	sudo dnf -y install python3-flask yarnpkg npm
	cd frontend && yarn install
	make transpile-prod

install-logos:
	ln -s $(CURDIR)/files/logos/stg/* $(CURDIR)/frontend/public/
	ln -s $(CURDIR)/files/logos/stg.png $(CURDIR)/frontend/src/static/logo.png

# this will transpile jsx into js, minify everything and generate static js for production builds
transpile-prod:
	cd frontend && REACT_APP_API_URL=$(API_STG) yarn build


# For Development Mode Only:
# this will start the react dev server on :3000 (by default)
# and flask on :5000
# do not use the flask port for frontend dev, as that will only show the frontend from the latest transpile-prod
# interact with :3000 (react dev server) for frontend dev and it will automatically proxy non react requests to flask
# while also proxying headers and cookies
# if you change flask port for dev, also change it in frontend/package.json in the proxy key/value

run-dev-frontend:
	cd frontend && REACT_APP_API_URL=$(API_STG) yarn start

run-dev-flask:
	FLASK_ENV=development FLASK_APP=packit_dashboard.app flask-3 run --host=0.0.0.0

run-container-stg: build-stg
	$(CONTAINER_ENGINE) run --rm -p 8443:8443 -v $(CURDIR)/secrets:/secrets:z -i $(IMAGE)

build-stg:
	$(CONTAINER_ENGINE) build --rm \
		--build-arg REACT_APP_API_URL=$(API_STG) \
		-t $(IMAGE) -f Dockerfile .

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

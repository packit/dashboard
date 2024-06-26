CURDIR := ${CURDIR}
IMAGE ?= quay.io/packit/dashboard:stg
TEST_IMAGE ?= packit-dashboard-tests
TEST_TARGET ?= ./tests/
CONTAINER_ENGINE ?= $(shell command -v podman 2> /dev/null || echo docker)
API_URL ?= "https://stg.packit.dev/api"
GIT_SHA_FETCH := $(shell git rev-parse HEAD)
export GIT_SHA=$(GIT_SHA_FETCH)

install-dependencies: .install-logos
	sudo dnf -y install python3-flask python3-flask-cors python3-flask-talisman
	corepack enable pnpm
	cd frontend && pnpm install
	make transpile-prod

.install-logos:
	ln -s -f $(CURDIR)/files/logos/stg/* $(CURDIR)/frontend/public/
	ln -s -f $(CURDIR)/files/logos/stg.png $(CURDIR)/frontend/src/static/logo.png
	touch $@

# this will transpile tsx into js, minify everything and generate static js for production builds
transpile-prod:
	cd frontend && VITE_GIT_SHA=$(GIT_SHA) VITE_API_URL=$(API_URL) pnpm run build


# For Development Mode Only:
# this will start the react dev server on :3000 (by default)
# and flask on :5000
# do not use the flask port for frontend dev, as that will only show the frontend from the latest transpile-prod
# interact with :3000 (react dev server) for frontend dev and it will automatically proxy non react requests to flask
# while also proxying headers and cookies
# if you change flask port for dev, also change it in frontend/package.json in the proxy key/value

run-dev-frontend:
	cd frontend && VITE_GIT_SHA=$(GIT_SHA) VITE_API_URL=$(API_URL) GENERATE_SOURCEMAP=true HTTPS=true pnpm start

run-dev-flask:
	FLASK_DEBUG=1 FLASK_APP=packit_dashboard.app VITE_GIT_SHA=$(GIT_SHA) VITE_API_URL=$(API_URL) flask-3 run --host=0.0.0.0

storybook:
	cd frontend && pnpm storybook


run-container-stg: build-stg
	$(CONTAINER_ENGINE) run -i --rm -u 1234 -p 8443:8443 -v $(CURDIR)/secrets:/secrets:ro,z $(IMAGE)

build-stg:
	$(CONTAINER_ENGINE) build --rm \
		--build-arg VITE_API_URL=$(API_URL) \
		--build-arg VITE_GIT_SHA=$(GIT_SHA) \
		-t $(IMAGE) -f Dockerfile .

push-stg: build-stg
	$(CONTAINER_ENGINE) push $(IMAGE)

oc-import-image:
	oc import-image is/packit-dashboard:stg

check:
	PYTHONPATH=$(CURDIR) PYTHONDONTWRITEBYTECODE=1 python3 -m pytest --color=yes --verbose --showlocals --cov=packit_dashboard --cov-report=term-missing $(TEST_TARGET)

test_image: files/ansible/install-deps.yaml files/ansible/recipe-tests.yaml
	$(CONTAINER_ENGINE) build --rm -t $(TEST_IMAGE) -f Dockerfile.tests .

check_in_container: test_image
	$(CONTAINER_ENGINE) run --rm \
		--security-opt label=disable \
		$(TEST_IMAGE) make check

CURDIR := ${CURDIR}
IMAGE ?= usercont/packit-dashboard:stg
TEST_IMAGE ?= packit-dashboard-tests
TEST_TARGET ?= ./tests/
CONTAINER_ENGINE ?= docker

install-dependencies:
	if [ -f "/etc/redhat-release" ];\
	 then\
		sudo dnf -y install python3-flask npm;\
	elif [ -f "/etc/debian_version" ];\
	 then\
		sudo apt -y install python3-flask npm;\
	fi
	npm install
run:
	FLASK_ENV=development FLASK_APP=packit_dashboard.app flask-3 run

run-docker-stg: build-stg
	docker run -p 443:8443 -v $(CURDIR)/secrets:/secrets -i $(IMAGE)

build-stg:
	docker build --rm -t $(IMAGE) -f Dockerfile .

push-stg: build-stg
	docker push $(IMAGE)

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

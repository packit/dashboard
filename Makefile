CURDIR := ${CURDIR}
IMAGE ?= usercont/packit-dashboard:stg

install-dependencies:
	sudo dnf -y install python3-flask npm
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

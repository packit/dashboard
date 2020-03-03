CURDIR := ${CURDIR}
IMAGE ?= usercont/packit-dashboard:stg
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

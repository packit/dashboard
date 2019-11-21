install-dependencies:
	sudo dnf -y install npm
	sudo pip3 install flask
	npm install @patternfly/patternfly --save

run:
	python3 main.py

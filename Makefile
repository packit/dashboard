install-dependencies:
	sudo dnf -y install python3-flask npm
	npm install

run:
	FLASK_ENV=development python3 main.py

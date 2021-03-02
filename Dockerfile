FROM quay.io/packit/base

ENV HOME=/home/packit_dashboard

COPY ./files /src/files
COPY ./package.json /src
COPY ./webpack.config.js /src
COPY ./babel.config.js /src

WORKDIR "/src"

RUN ansible-playbook -vv -c local -i localhost, files/ansible/install-deps.yaml \
    && dnf clean all

COPY ./packit_dashboard  /src/packit_dashboard
COPY ./templates  /src/templates
COPY ./static /src/static
COPY ./frontend /src/frontend


RUN ansible-playbook -vv -c local -i localhost, ./files/ansible/recipe.yaml

EXPOSE 8443

CMD ["/usr/bin/run_httpd.sh"]

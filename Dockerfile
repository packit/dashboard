FROM fedora:32

ENV HOME=/home/packit_dashboard \
    ANSIBLE_STDOUT_CALLBACK=debug

RUN dnf install -y ansible

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

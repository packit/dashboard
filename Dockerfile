FROM quay.io/packit/base

# set default value, can be overriden by --build-arg while building
ARG REACT_APP_API_URL=https://stg.packit.dev/api
ENV REACT_APP_API_URL ${REACT_APP_API_URL}

ENV HOME=/home/packit_dashboard

WORKDIR /src

COPY files/ files/

RUN ansible-playbook -vv -c local -i localhost, files/ansible/install-deps.yaml \
    && dnf clean all

COPY packit_dashboard/  packit_dashboard/
COPY frontend/ frontend/

RUN ansible-playbook -vv -c local -i localhost, files/ansible/recipe.yaml

EXPOSE 8443

CMD ["/usr/bin/run_httpd.sh"]

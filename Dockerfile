FROM quay.io/packit/base

# set default value, can be overriden by --build-arg while building
ARG VITE_API_URL=https://stg.packit.dev/api
ENV VITE_API_URL ${VITE_API_URL}

ARG VITE_GIT_SHA=dev
ENV VITE_GIT_SHA ${VITE_GIT_SHA}

ENV HOME=/home/packit_dashboard

WORKDIR /src

COPY files/ansible/install-deps.yaml files/ansible/
RUN ansible-playbook -vv -c local -i localhost, files/ansible/install-deps.yaml \
    && dnf clean all

COPY packit_dashboard/  packit_dashboard/
COPY frontend/ frontend/

COPY files/ files/
RUN ansible-playbook -vv -c local -i localhost, files/ansible/recipe.yaml

EXPOSE 8443

CMD ["/usr/bin/run_httpd.sh"]

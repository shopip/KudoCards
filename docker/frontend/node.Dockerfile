FROM node:13.14.0-slim

ARG HTTP_PROXY=""
ARG HTTPS_PROXY=""
ARG NO_PROXY="localhost,127.0.0.*"

LABEL maintainer="Ahmedul Haque Abid <a_h_abid@hotmail.com>"

ENV http_proxy "${HTTP_PROXY}"
ENV https_proxy "${HTTPS_PROXY}"
ENV no_proxy "${NO_PROXY}"

WORKDIR /app

# copy package.json and lock files
COPY ./frontend/package*.json ./

RUN if [ ! -z "${HTTP_PROXY}" ]; then \
        npm config set proxy "${HTTP_PROXY}" && \
        yarn config set proxy "${HTTP_PROXY}" \
    ;fi && \
    if [ ! -z "${HTTPS_PROXY}" ]; then \
        npm config set https-proxy "${HTTPS_PROXY}" && \
        yarn config set https-proxy "${HTTPS_PROXY}" \
    ;fi && \
    npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY ./frontend/ ./

# RUN npm run build

CMD [ "npm", "run", "start" ]

EXPOSE 4200

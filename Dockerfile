FROM alpine:3.23.3 AS builder
WORKDIR /app
COPY . .

FROM nginxinc/nginx-unprivileged:stable-alpine

LABEL maintainer="Mukund Yedunuthala" \
      version="2.0.3" \
      security.policy="rootless"

COPY --from=builder --chown=101:101 /app /usr/share/nginx/html
COPY --chown=101:101 nginx/headers.conf /etc/nginx/conf.d/headers.conf
COPY --chown=101:101 docker/40-inject-env.sh /docker-entrypoint.d/40-inject-env.sh

RUN sed -i 's|error_log  /var/log/nginx/error.log notice;|error_log  /var/log/nginx/error.log warn;|' /etc/nginx/nginx.conf && \
    sed -i 's|access_log  /var/log/nginx/access.log  main;|access_log off;|' /etc/nginx/nginx.conf

EXPOSE 8080

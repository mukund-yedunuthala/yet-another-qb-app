FROM alpine:3.23.3 as builder
WORKDIR /app
COPY . .

FROM nginxinc/nginx-unprivileged:stable-alpine

LABEL maintainer="Mukund Yedunuthala" \
      version="2.0.0" \
      security.policy="rootless"

COPY --from=builder /app /usr/share/nginx/html

USER root
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-inject-env.sh && \
    echo 'for file in /usr/share/nginx/html/js/*.js; do' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|__APPWRITE_ENDPOINT__|${APPWRITE_ENDPOINT}|g" "$file"' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|__APPWRITE_PROJECT_ID__|${APPWRITE_PROJECT_ID}|g" "$file"' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|__APPWRITE_DATABASE_ID__|${APPWRITE_DATABASE_ID}|g" "$file"' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  sed -i "s|__APPWRITE_TABLE_ID__|${APPWRITE_TABLE_ID}|g" "$file"' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo 'done' >> /docker-entrypoint.d/40-inject-env.sh && \
    chmod +x /docker-entrypoint.d/40-inject-env.sh && \
    chown -R 101:101 /usr/share/nginx/html/js
USER 101
RUN sed -i 's|error_log  /var/log/nginx/error.log notice;|error_log  /var/log/nginx/error.log warn;|' /etc/nginx/nginx.conf && \
    sed -i 's|access_log  /var/log/nginx/access.log  main;|access_log off;|' /etc/nginx/nginx.conf && \
    chown -R 101:101 /usr/share/nginx/html/js
EXPOSE 8080
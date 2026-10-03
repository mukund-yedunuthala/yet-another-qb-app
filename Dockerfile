FROM scratch

LABEL maintainer="Mukund Yedunuthala" \
      version="2.1.1" \
      security.policy="rootless"

COPY server /server
COPY index.html favicon.svg /app/
COPY css /app/css
COPY js /app/js
COPY pages /app/pages

USER 65532:65532

EXPOSE 8080
ENTRYPOINT ["/server"]

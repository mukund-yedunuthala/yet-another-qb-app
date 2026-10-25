FROM scratch

# Modified 2026-10-25: serve the Vite bundle and bump the app version to 2.1.2.
LABEL maintainer="Mukund Yedunuthala" \
      version="2.1.2" \
      security.policy="rootless"

COPY bin/server /server
COPY dist/ /app/

USER 65532:65532

EXPOSE 8080
ENTRYPOINT ["/server"]

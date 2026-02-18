docker buildx build -t yaqba:2.0.2 . &&
docker image save --platform=linux/amd64 yaqba:2.0.2 | gzip > yaqba_v2.0.2_amd64.tar.gz
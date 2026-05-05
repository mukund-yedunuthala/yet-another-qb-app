docker buildx build -t yaqba:2.0.4 . &&
docker image save --platform=linux/amd64 yaqba:2.0.4 | gzip > yaqba_v2.0.4_amd64.tar.gz

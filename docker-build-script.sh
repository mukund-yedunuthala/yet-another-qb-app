docker buildx build -t yaqba:2.0.3 . &&
docker image save --platform=linux/amd64 yaqba:2.0.3 | gzip > yaqba_v2.0.3_amd64.tar.gz

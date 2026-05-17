docker buildx build -t yaqba:2.0.5 . &&
docker image save --platform=linux/amd64 yaqba:2.0.5 | gzip > yaqba_v2.0.5_amd64.tar.gz

#!/bin/sh
set -eu

version=2.1.0
image="yaqba:$version"
tarball="yaqba_v${version}_amd64.tar.gz"

command -v go >/dev/null || { echo "go is required" >&2; exit 1; }
command -v npm >/dev/null || { echo "npm is required" >&2; exit 1; }
command -v docker >/dev/null || { echo "docker is required" >&2; exit 1; }

export GOCACHE="${GOCACHE:-/tmp/yaqba-go-cache}"

go test ./...
npm test

CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o server server.go

file server | grep -q 'ELF 64-bit.*x86-64.*statically linked' || {
  echo "server is not a static linux/amd64 binary" >&2
  file server >&2
  exit 1
}

docker build -t "$image" .
docker image inspect "$image" >/dev/null
docker image save --platform=linux/amd64 "$image" | gzip > "$tarball"

echo "Built $image and exported $tarball"

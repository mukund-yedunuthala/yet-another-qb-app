GOCACHE ?= /tmp/yaqba-go-cache
PORT ?= 5173

.PHONY: run test build dist clean

run:
	STATIC_DIR=. PORT=$(PORT) GOCACHE=$(GOCACHE) go run ./server

test:
	GOCACHE=$(GOCACHE) go test ./...
	npm test

build:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GOCACHE=$(GOCACHE) go build -trimpath -ldflags="-s -w" -o bin/server ./server

dist:
	bash scripts/docker-build-script.sh

clean:
	rm -rf bin yaqba_v*_amd64.tar.gz

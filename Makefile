GOCACHE ?= /tmp/yaqba-go-cache
PORT ?= 5173

.PHONY: run test build dist clean

run:
	STATIC_DIR=. PORT=$(PORT) GOCACHE=$(GOCACHE) go run server.go

test:
	GOCACHE=$(GOCACHE) go test ./...
	npm test

build:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 GOCACHE=$(GOCACHE) go build -trimpath -ldflags="-s -w" -o server server.go

dist:
	bash docker-build-script.sh

clean:
	rm -rf server yaqba_v*_amd64.tar.gz .svelte-kit

# AGENTS.md

This file provides platform-agnostic guidance for coding agents working in this repository.

## What This Is

Yet Another Question Bank App (YAQBA) is a vanilla JavaScript single-page app for managing and practicing MCQ questions. It has no build step and no framework.

The `.svelte-kit/` directory is a stale artifact from a previous rewrite and can be ignored.

## Running Locally

Serve the files with any static server:

```sh
npx serve .
# or
python -m http.server 5173
```

Before serving, replace the `__PLACEHOLDER__` tokens in `js/config.js` with real Appwrite credentials, typically copied from `.env`. The `.env` file is not auto-injected in local development; that only happens inside Docker.

## Docker

Run tests:

```sh
go test ./...
npm test
```

Build the local Go server binary, Docker image, and exported tarball:

```sh
bash docker-build-script.sh
```

Run with Docker Compose:

```sh
docker compose up -d
```

Docker Compose uses `.env` values read by the Go server at request time. The container is exposed on port `8880`; the server listens on `8080` inside the container.

The Go server serves `/js/config.js` dynamically using environment variables passed without the `PUBLIC_` prefix. Use `APPWRITE_ENDPOINT`, not `PUBLIC_APPWRITE_ENDPOINT`, inside the container. `PUBLIC_APPWRITE_*` is accepted as a fallback.

Logs go to stdout for `docker compose logs`. `LOG_LEVEL` supports `debug`, `info`, `warn`, and `error` with default `info`; `LOG_FORMAT` supports `text` and `json` with default `text`.

Security headers and SPA fallback are handled by `server.go`. The Dockerfile uses a prebuilt local `server` binary and a `scratch` runtime image.

## Architecture

```text
index.html          Single HTML shell; loads CDN deps (Oat UI, Appwrite SDK, Navigo).
                    CDN resources are pinned to exact versions with SRI hashes.
js/
  app.js            Entry point: theme toggle, calls initRouter().
  router.js         Navigo SPA router; maps URL paths to render functions; also contains
                    inline renderers for /about, /imprint, and /privacy.
  appwrite.js       All Appwrite CRUD: getQuestions, createQuestion, updateQuestion,
                    deleteQuestion, markAsLearnt, getSubjects, getStats.
  config.js         Exports Appwrite config constants for local static serving;
                    Docker serves this path dynamically from environment variables.
  utils.js          Shared helpers, including escHtml() for safe innerHTML interpolation.
pages/
  home.js           Dashboard with stats summary.
  questions.js      Question list with subject filter.
  create.js         Create/edit form; doubles as edit when called with questionId.
  subjects.js       Subject browser with per-subject progress.
  flashcards.js     Interactive study mode with shuffle and learnt tracking.
  stats.js          Detailed statistics with per-subject breakdown.
css/styles.css      Custom overrides on top of Oat UI.
server.go           Docker static server, env config endpoint, security headers, SPA fallback.
```

Each `pages/*.js` file exports a single `render*()` function that replaces `#app-content` innerHTML and calls `updatePageLinks()` so Navigo picks up newly injected `data-navigo` links.

## Data Model

Appwrite collection `questions` fields:

- `question`: string
- `optionA` through `optionD`: string
- `correctAnswer`: integer, 0-based index where `0=A`, `1=B`, `2=C`, `3=D`
- `subject`: string
- `explanation`: optional string
- `learnt`: boolean

Subjects are derived by querying all questions and extracting unique `subject` values. There is no separate subjects collection.

## Key Conventions

- After injecting HTML into `#app-content`, always call `updatePageLinks()` so Navigo intercepts new `data-navigo` anchors.
- Store and compare `correctAnswer` as a 0-based integer.
- Keep all Appwrite SDK usage in `js/appwrite.js`; page modules should import from there instead of calling the SDK directly.
- Never interpolate Appwrite document fields directly into HTML strings. Wrap document fields with `escHtml()` from `js/utils.js`.
- Numeric and boolean computed values, such as counts, progress percentages, `isCorrect`, and `!q.learnt`, are safe to interpolate without escaping.
- Preserve the no-build, no-framework model unless the user explicitly asks for a larger architectural change.
- Do not treat `.env` as client-side configuration. Local static serving requires manually replacing placeholders in `js/config.js`; Docker serves `/js/config.js` dynamically from runtime environment variables.

## Codex Workflows

### `bump-version`

When asked to bump the project version, accept `major`, `minor`, `patch` (default), or an explicit semver such as `2.1.0`.

1. Find project version strings with `rg`, ignoring `.git/`, `node_modules/`, lockfiles, `.svelte-kit/`, CDN URLs, SRI hashes, and binary/dist artifacts.
2. Treat the project version as the semver appearing in release/deployment surfaces such as `Dockerfile`, `docker-compose.yml`, `docker-build-script.sh`, `index.html`, `js/router.js`, or package metadata if present. Do not change dependency versions.
3. Compute the new version from the requested bump or explicit semver.
4. Update only files containing the project version, using normal file edits.
5. Stage only modified version files and commit with `chore: bump version to <new_version>` when the user asked for the full command behavior.
6. Report each file changed and the old -> new substitution.

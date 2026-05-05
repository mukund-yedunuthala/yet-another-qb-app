# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Yet Another Question Bank App (YAQBA) — a vanilla JavaScript SPA for managing and practicing MCQ questions. No build step, no framework. The `.svelte-kit/` directory is a stale artifact from a previous rewrite and can be ignored.

## Running locally

Serve the files with any static server:

```sh
npx serve .
# or
python -m http.server 5173
```

Before serving, replace the `__PLACEHOLDER__` tokens in `js/config.js` with real Appwrite credentials (copy from `.env`). The `.env` file is **not** auto-injected in local development — that only happens inside Docker.

## Docker

Build and export:
```sh
bash docker-build-script.sh
```

Run with docker-compose (uses `.env` values injected at container startup):
```sh
docker compose up -d
```

The container runs on port `8880` (nginx on `8080`). At startup, `docker/40-inject-env.sh` (registered as a Docker entrypoint script) does `sed` substitution of `__APPWRITE_*__` tokens in `js/*.js` using env vars passed **without** the `PUBLIC_` prefix (i.e. `APPWRITE_ENDPOINT`, not `PUBLIC_APPWRITE_ENDPOINT`).

Security headers are served via `nginx/headers.conf` (copied into `/etc/nginx/conf.d/` during image build). The Dockerfile never switches to `USER root` — all root-time operations are handled via `COPY --chown=101:101`.

## Architecture

```
index.html          Single HTML shell; loads CDN deps (Oat UI, Appwrite SDK, Navigo)
                    All CDN resources are pinned to exact versions with SRI hashes.
js/
  app.js            Entry point — theme toggle, calls initRouter()
  router.js         Navigo SPA router; maps URL paths to render functions; also contains
                    inline renderers for /about, /imprint, /privacy
  appwrite.js       All Appwrite CRUD (getQuestions, createQuestion, updateQuestion,
                    deleteQuestion, markAsLearnt, getSubjects, getStats)
  config.js         Exports Appwrite config constants; contains __PLACEHOLDER__ tokens
                    replaced at Docker startup by docker/40-inject-env.sh
  utils.js          Shared helpers — escHtml() for safe innerHTML interpolation
pages/
  home.js           Dashboard with stats summary
  questions.js      Question list with subject filter
  create.js         Create/edit form (doubles as edit when called with questionId)
  subjects.js       Subject browser with per-subject progress
  flashcards.js     Interactive study mode with shuffle and learnt tracking
  stats.js          Detailed statistics with per-subject breakdown
css/styles.css      Custom overrides on top of Oat UI
docker/
  40-inject-env.sh  Entrypoint script that injects env vars into js/config.js at runtime
nginx/
  headers.conf      nginx server block adding CSP, X-Content-Type-Options, X-Frame-Options
```

Each `pages/*.js` file exports a single `render*()` function that replaces `#app-content` innerHTML and calls `updatePageLinks()` for Navigo to pick up new `data-navigo` links.

## Data model

Appwrite collection `questions` with fields: `question` (str), `optionA`–`optionD` (str), `correctAnswer` (int 0–3), `subject` (str), `explanation` (str, optional), `learnt` (bool).

Subjects are derived by querying all questions and extracting unique values — there is no separate subjects collection.

## Key conventions

- After injecting HTML into `#app-content`, always call `updatePageLinks()` so Navigo intercepts the new `data-navigo` anchors.
- `correctAnswer` is a 0-based index (0=A, 1=B, 2=C, 3=D), stored as integer.
- All Appwrite calls are in `js/appwrite.js`; pages import from there, never call the SDK directly.
- **Never interpolate Appwrite document fields directly into HTML strings.** Always wrap with `escHtml()` from `js/utils.js`. Numeric/boolean computed values (counts, progress percentages, `isCorrect`, `!q.learnt`) are safe to interpolate without escaping.

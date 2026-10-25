# Yet Another Question Bank App

A personal MCQ question bank — create, browse, and practice with flashcards. Built with vanilla JavaScript and Vite; browser dependencies are installed and bundled with pnpm.

[![AI-DECLARATION: copilot](https://img.shields.io/badge/䷼%20AI--DECLARATION-copilot-fee2e2?labelColor=fee2e2)](https://ai-declaration.md)
![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white)
![License](https://img.shields.io/badge/license-AGPL--3.0-blue?style=for-the-badge)

> **Note:** This repository is maintained for personal use and is currently **not accepting contributions** (pull requests or issue filings).

## Stack

| Layer | Technology |
|---|---|
| UI | [Oat](https://github.com/knadh/oat) (pnpm package) |
| Routing | [Navigo](https://github.com/krasimir/navigo) (pnpm package) |
| Backend | [Appwrite](https://appwrite.io/) cloud |
| Build | Vite, managed with pnpm |
| Serving | Go static server (Docker) or any static server |

## Features

- Create and edit multiple-choice questions (4 options, optional explanation)
- Organize questions by subject
- Flashcard study mode with shuffle and subject filter
- Mark questions as learnt to track progress
- Statistics view with per-subject breakdown
- Dark/light theme toggle

## Screenshots

### Dashboard

Stats summary and quick actions.

![Dashboard](docs/screenshots/home.png)

### Subjects

Per-subject progress overview.

![Subject browser](docs/screenshots/subjects.png)

## Appwrite Setup

Create a project in [Appwrite Console](https://cloud.appwrite.io), then create a database and a collection named `questions` with these fields:

| Field | Type | Size | Required | Default |
|---|---|---|---|---|
| `question` | String | 1000 | Yes | — |
| `optionA` | String | 500 | Yes | — |
| `optionB` | String | 500 | Yes | — |
| `optionC` | String | 500 | Yes | — |
| `optionD` | String | 500 | Yes | — |
| `correctAnswer` | Integer | — | Yes | — |
| `subject` | String | 100 | Yes | — |
| `explanation` | String | 2000 | No | — |
| `learnt` | Boolean | — | Yes | false |

`correctAnswer` is 0-based (0 = A, 1 = B, 2 = C, 3 = D).

Set collection permissions according to your access needs. Subjects are derived from question data — there is no separate subjects collection.

## Running locally

<!-- Modified 2026-10-25: document pnpm-managed browser dependencies and Vite builds. -->
Install the JavaScript dependencies once (Node.js 20.19+ and pnpm 12.15.0 are required):

```sh
pnpm install --frozen-lockfile
```

### Run with the Go server

Copy `.env.example` to `.env` and fill in your Appwrite credentials. `make run` does not load `.env` automatically; export its values before starting the server:

```sh
cp .env.example .env
# Edit .env, then:
set -a
. ./.env
set +a
make run
```

`make run` builds the frontend with Vite, then starts the Go server. The server dynamically serves `/js/config.js` from environment variables. It accepts both `APPWRITE_*` and `PUBLIC_APPWRITE_*` names. Go is required for this option.

### Use another static server

For a static server, replace the `__PLACEHOLDER__` tokens in `public/js/config.js` with your Appwrite credentials; `.env` is not automatically read by static servers. Build the app and serve `dist/`:

```sh
pnpm build
pnpm dlx serve dist
# or
python -m http.server 5173 --directory dist
```

For development with Vite, run `pnpm dev` after setting the credentials in `public/js/config.js`.

## Docker

Run tests:

```sh
make test
```

Build the local Go server binary, Docker image, and exported tarball:

```sh
make dist
```

Run with Docker Compose. The Go server serves `/js/config.js` from `.env` values at request time:

```sh
docker compose up -d
```

The app is available at [http://localhost:8880](http://localhost:8880).

The server reads env vars passed **without** the `PUBLIC_` prefix (i.e. `APPWRITE_ENDPOINT`, not `PUBLIC_APPWRITE_ENDPOINT`). `PUBLIC_APPWRITE_*` is accepted as a fallback.

Logs go to stdout and are visible with Docker Compose:

```sh
docker compose logs -f
LOG_LEVEL=debug docker compose up
LOG_FORMAT=json docker compose up
```

`LOG_LEVEL` supports `debug`, `info`, `warn`, and `error`; default is `info`. `LOG_FORMAT` supports `text` and `json`; default is `text`.

Security headers (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`) and SPA fallback are handled by `server/server.go`.

## Project structure

```
index.html              Single HTML shell — defines header/footer; Vite injects built assets
vite.config.js           Vite build configuration
public/js/config.js      Static Appwrite config; Go server overrides this route at runtime
js/
  app.js                Entry point — imports Oat CSS, theme toggle, calls initRouter()
  router.js             Navigo SPA router; maps URL paths to render functions;
                        also contains inline renderers for /about, /imprint, /privacy
  appwrite.js           All Appwrite CRUD (getQuestions, createQuestion, updateQuestion,
                        deleteQuestion, markAsLearnt, getSubjects, getStats)
  utils.js              Shared helpers (escHtml for XSS-safe innerHTML interpolation)
pages/
  home.js               Dashboard with stats summary
  questions.js          Question list with subject filter
  create.js             Create/edit form (doubles as edit when called with questionId)
  subjects.js           Subject browser with per-subject progress
  flashcards.js         Interactive study mode with shuffle and learnt tracking
  stats.js              Detailed statistics with per-subject breakdown
css/styles.css          Custom overrides on top of Oat UI
dist/                   Vite-generated deployable frontend (created by pnpm build)
server/server.go        Docker static server, env config endpoint, security headers
```

Each `pages/*.js` file exports a single `render*()` function that replaces `#app-content` innerHTML and calls `updatePageLinks()` for Navigo to pick up new `data-navigo` links.

## License

AGPL-3.0-only — see [LICENSE](LICENSE).

# Changelog

### [v2.1.1](https://github.com/mukund-yedunuthala/yet-another-qb-app/compare/v2.1.0...v2.1.1) (2026-10-03)

#### Fixes

* handle deep links and invalid question edits
([0e60924](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/0e609242656e2cb323538d61435b410e834cf7aa))
* **ui:** replace inline style attributes with CSS classes
([7d37909](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/7d379096bf6528f8c438aeea8bcc3f1f3ebb08e6))
* **flashcards:** set progress bar width via CSSOM
([580c6b6](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/580c6b6ea8798ca3707f97bf642e8106e6e9e140))
* **ui:** define missing .stats-grid and .subject-grid layouts
([4f7587f](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/4f7587fd9deebc80bc139100de8c38d9c45ad1bb))

## [v2.1.0](https://github.com/mukund-yedunuthala/yet-another-qb-app/compare/v2.0.6...v2.1.0) (2026-10-03)

### Features

* **ui:** replace ICO favicon with SVG
([906cd6c](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/906cd6c3a45b3df74d0e8b27ee3ee006fb3c034d))

### [v2.0.6](https://github.com/mukund-yedunuthala/yet-another-qb-app/compare/v2.0.5...v2.0.6) (2026-06-25)

#### Features

* add Go static server with structured logging
([b7e81ab](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/b7e81abdde942091949392f1359866e7733c7cb4))

### [v2.0.5](https://github.com/mukund-yedunuthala/yet-another-qb-app/compare/v2.0.4...v2.0.5) (2026-05-17)

#### Features

* fix pagination, add JSON export, add question search
([7a36cb6](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/7a36cb6dda9af1ff32989293ad217cae113d0db0))

### [v2.0.4](https://github.com/mukund-yedunuthala/yet-another-qb-app/compare/v2.0.3...v2.0.4) (2026-05-05)

#### Features

* **utils:** add showError helper and error-message CSS
([92aad4c](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/92aad4c859f871b66c5408e0d9687d7a33caf74a))

#### Fixes

* **create:** guard double-submit; replace alert() with showError()
([40694e0](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/40694e0f4226fc331a4a429fa4066265dd833179))
* **flashcards:** fix XSS in error handler; replace alert() with showError()
([1ed3fe4](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/1ed3fe47b2a849ed0ae08ad27eb5a0f5c26161e3))
* **subjects:** replace N+1 requests with single fetch and group-by
([3b63c6f](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/3b63c6fbfe346041c027d3d245528cab3a2d28ec))
* **stats:** single network request; fix XSS in error handler
([814798f](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/814798feb32c0f7f1f0e33076b331b90c6c6c6ef))
* **questions:** module-level filter state, router navigation, XSS, error UX
([47d2dd9](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/47d2dd985bfef8b214f480423dcf16829dbae1fe))
* **router:** add notFound handler for unmatched routes
([58063cb](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/58063cb71fef3ddbf7b76cf89cad1ca4810d1830))
* **sri:** CORS errors in navigo; uses CDN
([90f3ed6](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/90f3ed6bd9c29166e3ec289583a79d7e14bb0141))

### [v2.0.3](https://github.com/mukund-yedunuthala/yet-another-qb-app/compare/v2.0.1...v2.0.3) (2026-05-05)

#### Fixes

* **docker:** add CSP headers and eliminate USER root
([72a764a](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/72a764a67a5c494651ccdc70cdcffa84e7e18b29))
* **sri:** pin CDN deps to exact versions with SRI hashes
([9f72491](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/9f7249197d456b09f4a9e07568ace6e6b42833f4))
* **xss:** escape user data before innerHTML interpolation
([a7860dd](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/a7860dd3f7723ca0b702919b2b944da14782779d))

### [v2.0.1](https://github.com/mukund-yedunuthala/yet-another-qb-app/compare/v1.0.1...v2.0.1) (2026-02-18)

### v1.0.1 (2025-12-10)

#### Features

* add flashcard impl
([cca0e82](https://github.com/mukund-yedunuthala/yet-another-qb-app/commit/cca0e82c2aa6df591f6eb722c43b1fde5f1e4524))

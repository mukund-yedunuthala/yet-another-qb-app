Bump the project version number everywhere it appears and commit the result.

Arguments: $ARGUMENTS — one of `major`, `minor`, `patch` (default: `patch`), or an explicit target version like `2.1.0`.

## Steps

### 1. Find the current version

Grep the project for semver strings, ignoring `.git/`, `node_modules/`, lockfiles, and binary/dist artifacts:

```
grep -rn --include="*.js" --include="*.html" --include="*.json" \
     --include="*.yml" --include="*.yaml" --include="*.sh" \
     --include="*.md" --include="*.conf" --include="*.txt" \
     --include="Dockerfile" \
     -E '[0-9]+\.[0-9]+\.[0-9]+' . \
  | grep -v '\.git\|node_modules\|package-lock\|yarn\.lock\|\.svelte-kit\|CDN\|sri\|sha\|integrity\|jsdelivr\|unpkg\|cdnjs'
```

From the results, identify the **project version** — the semver that appears in deployment/release artefacts (Dockerfile, docker-compose, build scripts, HTML footer, About page, package.json `"version"` field). Ignore library/dependency versions.

### 2. Compute the new version

- If `$ARGUMENTS` is an explicit semver (e.g. `2.1.0`), use it directly.
- Otherwise apply the bump type to the current version:
  - `major` → increment first segment, reset others to 0
  - `minor` → increment second segment, reset third to 0
  - `patch` (default) → increment third segment only

### 3. Update every occurrence

Replace the old version string with the new one in every file identified in step 1. Use the Edit tool (not sed) for each file so changes are reviewable. Only update files that contain the project version — do not touch dependency version strings in node_modules, lockfiles, or CDN URLs.

### 4. Commit

Stage only the files you modified and create a single commit:

```
chore: bump version to <new_version>
```

No trailing summary needed. Use the Co-Authored-By trailer as usual.

### 5. Report

List each file updated and the old → new substitution made.

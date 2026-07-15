---
name: Imported repo with pre-built artifact.toml but unregistered
description: What to do when a GitHub-imported project already has artifacts/*/.replit-artifact/artifact.toml files and pnpm-workspace multi-artifact structure, but listArtifacts() returns empty and workflows don't exist.
---

Some imported projects already carry the full Replit pnpm-workspace multi-artifact
layout (`artifacts/<slug>/.replit-artifact/artifact.toml`, `lib/*` shared packages)
from a prior export, but the platform's artifact/workflow registry doesn't know
about them yet (`listArtifacts()` returns `{ artifacts: [] }`, and the expected
managed workflows don't exist).

**Why:** `createArtifact()` refuses to run because the slug's directory already
exists (`ARTIFACT_DIR_EXISTS`), so it can't be used to (re-)register.

**How to apply:** For each existing `artifacts/<slug>/.replit-artifact/artifact.toml`,
copy it to a sibling temp file (e.g. `artifact.edit.toml`) unchanged and call
`verifyAndReplaceArtifactToml({ tempFilePath, artifactTomlPath })`. This single
call re-syncs the artifact into the registry AND creates its managed workflow(s)
in one shot — no need to touch every artifact if you only need one, but repeat
per artifact if there are several. After that, `pnpm install` (node_modules is
typically missing on fresh import) and `WorkflowsRestart` each service normally.

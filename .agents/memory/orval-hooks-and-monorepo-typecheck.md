---
name: orval-hooks-and-monorepo-typecheck
description: Gotchas when consuming an orval-generated React Query client (api-client-react) from a new package in this pnpm monorepo, and running its typecheck.
---

- When calling a generated `useXxx(params, { query: { enabled, ... } })` hook with `enabled`, TypeScript requires `queryKey` to also be passed explicitly (e.g. `queryKey: getXxxQueryKey(params)`), or `tsc` reports "Property 'queryKey' is missing". Passing only `enabled` type-checks fine at runtime but fails strict `tsc -p ... --noEmit`. Always import the matching `getXxxQueryKey` helper alongside the hook.
  **Why:** the generated `UseQueryOptions` overload used when narrowing `TData` doesn't default `queryKey`, unlike the internal `getXxxQueryOptions` which does. Existing admin pages already follow this pattern.
  **How to apply:** whenever wiring a new query call with `query.enabled`, add `queryKey: getXxxQueryKey(sameParamsObject)` in the same options object.

- A new package that imports `@workspace/api-client-react` (or any lib package with `"composite": true` + `emitDeclarationOnly` referenced via TS project references) will fail its own `tsc --noEmit` with `TS6305: Output file '.../dist/index.d.ts' has not been built` until the referenced lib's `dist/` is built at least once.
  **Why:** the lib's package.json exports point straight at `src` for bundlers, but the referencing tsconfig uses TS project references, which resolve declarations from `dist`, not `src`.
  **How to apply:** run `npx tsc -b tsconfig.json` from the monorepo root once per environment/checkout before trusting a new consumer's typecheck failures — it's often just a missing build, not a real type error.

- `lib/db` scripts that need `bcryptjs`/`tsx` (or any package only declared in a sibling artifact like `api-server`) are NOT available via pnpm workspace hoisting — add them as an explicit dependency/devDependency in `lib/db/package.json` and run `pnpm install` from the root, then run via `pnpm --filter @workspace/db exec tsx <script>`.
  **Why:** pnpm's strict workspace linking means each package only sees its own declared deps, not a sibling package's.

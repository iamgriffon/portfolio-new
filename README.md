# Portfolio

Next.js App Router portfolio with public content stored in Convex.

## Local development

Use Bun 1.3.14 or newer; `bun.lock` is the dependency lockfile.

```sh
bun install
cp .env.example .env.local
bun run dev
```

Set `NEXT_PUBLIC_CONVEX_URL` to the deployment that serves the portfolio queries.
The production deployment is `https://cautious-chihuahua-297.convex.cloud`.
`https://cautious-chihuahua-297.convex.site` is the HTTP Actions endpoint; this
app uses Convex queries, so that endpoint does not need an environment variable.

The site reads public content without credentials. `CONVEX_DEPLOY_KEY` is only
needed to deploy functions or administer/import data through the CLI. Keep it
in the ignored `.env.local` file or a CI secret, never in a `NEXT_PUBLIC_` variable.
Do not copy `.env.example` over an existing `.env.local` containing credentials.

## Convex backend

`convex/schema.ts` defines `job_history`, `education`, and `socials` with the
original numeric `id` retained alongside Convex's generated `_id`. Public
queries are in `convex/portfolio.ts`; no public write functions are exposed.
The internal `migrations:importPortfolio` function requires admin credentials.
Manage content using the Convex dashboard or authenticated CLI.

The resume preloads fresh data on the server with `preloadQuery` and subscribes
in the browser with `usePreloadedQuery`, under a shared `ConvexProvider`.
Job and education updates therefore reach an open page without refreshing or
waiting for a Next.js cache to expire.

Social links still use the Next.js server adapter in `src/db/convex.ts`, with a
one-hour cache and the `socialLinks` tag. Configure `REVALIDATION_SECRET` to use
the existing `/api/revalidate` endpoint for immediate social link updates.

After backend edits, publish functions and regenerate their bindings with:

```sh
bunx convex deploy --typecheck disable
```

This command bundles the backend. The Next.js hosting environment must also set
`NEXT_PUBLIC_CONVEX_URL` and publish the updated app; publishing the Convex
backend alone does not update the frontend.

## Restore the Supabase backup

The converter reads the gzip PostgreSQL dump without executing SQL. It exports
only the three public portfolio tables, preserves all their columns, Unicode,
SQL nulls and numeric IDs, and excludes auth/storage/internal tables.
The original archive and generated data stay in the ignored `backup/` folder.

```sh
bun run backup:convert 'backup/db_cluster-07-04-2025@14-27-10.backup.gz'
bunx convex data
bun run backup:import 'backup/db_cluster-07-04-2025@14-27-10.backup.gz'
bun run backup:verify 'backup/db_cluster-07-04-2025@14-27-10.backup.gz'
```

The CLI uses the deployment associated with `CONVEX_DEPLOY_KEY`. Confirm the
target before importing. Deploy the backend functions first. The internal
migration imports all three tables in one transaction, treats an identical
repeat as a no-op, and refuses to overwrite existing records that differ.
This path does not require the native importer’s `deployment:backups:view`
permission. The JSONL files remain available for native imports with a key
that has that permission.
The supplied backup has 4 jobs, 3 education records, and 6 social links.

Test the converter without running lint, typecheck, or build:

```sh
bun test scripts/convert-backup.test.ts
```

# Next.js + Postgres starter

A runnable Next.js application with one persistent demo note. All visitors share this synthetic example; it is not an authenticated notes product. Add authentication and authorization before using real customer data.

## Build with your coding agent

Paste this into your agent: “Read https://hostlittle.com/get-started.md and help me deploy this Next.js + Postgres starter on Host Little.” The included `AGENTS.md` covers this starter’s commands and data boundaries.

## Deploy on Host Little

Create your repository from the published `Jamyye/hostlittle-nextjs-postgres-starter` template, then open `https://hostlittle.com/get-started?template=nextjs-postgres&db=postgres`. Sign in, choose your copy and branch, and keep Postgres attached. Use build command `npm run build`, start command `npm start`, and health path `/api/health`. Node 22 is required.

The start command runs the idempotent migration before opening the HTTP listener and never resets an existing note. Builds do not require database credentials. Host Little's normal isolated build and protected runtime binding are used. Connection errors are generic; connection strings are not logged. After a push, wait for the deployment to finish and verify that `/api/health` reports `database: connected`.

Publish this directory as the template repository root. Do not import the platform monorepo instead. Publication is a separate release step, not something the export script performs.

## Local development

Use an empty local Postgres database. Copy `.env.example` to `.env.local` and edit the local connection value; never commit it.

```sh
npm ci
node --env-file=.env.local scripts/migrate.mjs
npm run dev
```

Remote connections always verify TLS. `STARTER_ALLOW_LOCAL_DATABASE=true` disables TLS only for loopback hosts. Run `npm run build` without database credentials. Supply DATABASE_URL only to the child environment for migrations and `npm start`. Do not copy production database URLs into previews or build/public variables. Names such as `NEXT_PUBLIC_*` are public browser configuration, never a place for credentials.

## Migrations and data

`migrations/001_note.sql` creates one bounded row with `ON CONFLICT DO NOTHING`. It runs under a transaction/advisory lock for concurrent starts. `npm run db:migrate` runs it when DATABASE_URL is supplied by the environment. Re-running it must preserve the note. SQL values are parameterized, note text is limited to 280 characters, and the request body is streamed with a 4 KiB limit.

The public demo intentionally allows visitors to replace its note. Browser-origin checking is CSRF protection, not authentication. Only synthetic test data belongs here.

## Acceptance

`npm test` checks TLS and mutation constraints. The proof script verifies the application's starter identity before writing. It writes a synthetic marker, reads through another HTTP request, and restores the previous note text. Run against your disposable starter only:

```sh
STARTER_PROOF_URL=https://your-starter.hostlittle.app npm run prove
```

For cross-process proof, run two app instances against one disposable DB and set `STARTER_PROOF_SECOND_URL` to the second origin. The script writes through the first and reads through the second. It can update only the singleton demo row, not arbitrary tables.

Preview databases must be fresh empty databases with separate credentials and TTL cleanup. This starter seeds its synthetic row there at startup; it does not copy production data or claim copy-on-write branching.

## License

Authored starter code is MIT licensed. Next.js and React are MIT licensed; postgres.js is Unlicense licensed. Installed dependencies retain their own license files. No third-party imagery or user analytics are included.

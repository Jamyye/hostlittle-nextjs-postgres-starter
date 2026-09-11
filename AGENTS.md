# Work on this starter

Read https://hostlittle.com/get-started.md for Host Little API/CLI/MCP setup.
Use the owner's connected project and private agent credential. Never include a
key or database connection value in chat, Git, public variables or build inputs.

This is a public synthetic demo note. Before turning it into a real product,
add authentication and per-user authorization. Preserve the bounded request
body, parameterized SQL, TLS verification and existing migration/data behavior.

- Node.js 22 or later; `npm ci`, `npm run build`, `npm start`.
- `npm start` applies idempotent migrations before listening. A build needs no DB.
- Keep `/api/health` and the database-backed note working when adapting the UI.
- `npm test` checks contracts. `npm run prove` is for a disposable starter only;
  it temporarily changes the shared demo note and restores its previous content.
- Push to the connected production branch, then verify terminal deployment,
  exact revision, health, and a real database-backed interaction.

Do not import the Host Little platform monorepo as this application's source.

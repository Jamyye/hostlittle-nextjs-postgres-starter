import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const url = new URL(process.env.STARTER_PROOF_URL || "http://127.0.0.1:3000");
if (!["http:", "https:"].includes(url.protocol) || url.username || url.password)
  throw new Error("Expected a starter URL without credentials");
const identityResponse = await fetch(new URL("/api/health", url));
assert.equal(identityResponse.status, 200);
assert.equal(
  (await identityResponse.json()).starterId,
  "hostlittle-nextjs-postgres-v1",
  "Refuse writes to a different application",
);
const secondUrl = process.env.STARTER_PROOF_SECOND_URL
  ? new URL(process.env.STARTER_PROOF_SECOND_URL)
  : url;
const get = async (origin = url) => {
  const response = await fetch(new URL("/api/note", origin), { cache: "no-store" });
  assert.equal(response.status, 200);
  return (await response.json()).note;
};
const before = await get(),
  marker = `Synthetic acceptance ${randomUUID()}`;
async function save(body) {
  const response = await fetch(new URL("/api/note", url), {
    method: "POST",
    headers: { Origin: url.origin, "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  assert.equal(response.status, 200);
  return (await response.json()).note;
}
try {
  const saved = await save(marker);
  assert.equal(saved.body, marker);
  assert.ok(BigInt(saved.revision) > BigInt(before.revision));
  const subsequent = await get(secondUrl);
  assert.equal(subsequent.body, marker);
  assert.equal(subsequent.revision, saved.revision);
  const health = await fetch(new URL("/api/health", url));
  assert.equal(health.status, 200);
  console.log(
    JSON.stringify({
      ok: true,
      check: "independent HTTP write/read and migrated database",
      synthetic: true,
    }),
  );
} finally {
  await save(before.body);
}

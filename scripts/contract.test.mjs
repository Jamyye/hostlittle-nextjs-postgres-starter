import assert from "node:assert/strict";
import test from "node:test";
import { databaseOptions } from "../lib/database.mjs";
import { parseNote, sameOrigin } from "../lib/note.mjs";
test("remote databases always verify TLS even when local development is allowed", () => {
  assert.equal(
    databaseOptions("postgres://fixture:fixture@db.example.test/db", true).ssl,
    "verify-full",
  );
  assert.throws(() => databaseOptions("postgres://fixture:fixture@127.0.0.1/db"));
  assert.equal(databaseOptions("postgres://fixture:fixture@127.0.0.1/db", true).ssl, false);
});
test("notes remain bounded and malformed text cannot poison PostgreSQL", () => {
  assert.equal(parseNote("Synthetic note"), "Synthetic note");
  for (const value of ["", "x".repeat(281), "x\0", {}, null]) assert.throws(() => parseNote(value));
});
test("browser mutations need matching origin; missing and foreign origins are rejected", () => {
  assert.equal(
    sameOrigin(
      new Request("https://app.example.test", {
        headers: { host: "app.example.test", origin: "https://app.example.test" },
      }),
    ),
    true,
  );
  assert.equal(
    sameOrigin(
      new Request("https://app.example.test", {
        headers: { host: "app.example.test", origin: "https://other.example.test" },
      }),
    ),
    false,
  );
  assert.equal(sameOrigin(new Request("https://app.example.test")), false);
});

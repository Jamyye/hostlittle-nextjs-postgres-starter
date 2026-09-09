import { readFile } from "node:fs/promises";
import { database, closeDatabase } from "../lib/database.mjs";
try {
  const sql = database();
  const migration = await readFile(new URL("../migrations/001_note.sql", import.meta.url), "utf8");
  await sql.begin(async (transaction) => {
    await transaction`select pg_advisory_xact_lock(732902104)`;
    await transaction.unsafe(migration);
  });
  console.log("Starter migration complete.");
} catch {
  console.error("Starter migration failed. Check the database binding and connectivity.");
  process.exitCode = 1;
} finally {
  await closeDatabase();
}

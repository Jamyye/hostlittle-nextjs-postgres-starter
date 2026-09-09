import postgres from "postgres";
let client;
export function databaseOptions(value, allowLocal = false) {
  if (!value) throw new Error("Database connection is not configured");
  const url = new URL(value);
  if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.username || !url.hostname)
    throw new Error("Invalid database connection");
  const local = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  if (local && !allowLocal) throw new Error("Local database requires explicit development opt-in");
  return {
    ssl: local ? false : "verify-full",
    max: 2,
    prepare: false,
    connect_timeout: 15,
    idle_timeout: 10,
    onnotice: () => {},
  };
}
export function databaseConnection(value, allowLocal = false) {
  const options = databaseOptions(value, allowLocal);
  const url = new URL(value);
  // postgres.js forwards libpq-only query parameters as PostgreSQL startup settings.
  // System roots are already enforced by verify-full above.
  if (url.searchParams.get("sslrootcert") === "system") url.searchParams.delete("sslrootcert");
  return [url.toString(), options];
}
export function database() {
  if (!client)
    client = postgres(
      ...databaseConnection(
        process.env.DATABASE_URL,
        process.env.STARTER_ALLOW_LOCAL_DATABASE === "true",
      ),
    );
  return client;
}
export async function closeDatabase() {
  if (client) {
    await client.end({ timeout: 5 });
    client = undefined;
  }
}

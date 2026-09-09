import { spawn } from "node:child_process";
import { once } from "node:events";
const migration = spawn(process.execPath, ["scripts/migrate.mjs"], { stdio: "inherit" });
const [code] = await once(migration, "close");
if (code !== 0) process.exit(code || 1);
const port = process.env.PORT || "3000";
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535)
  throw new Error("Invalid port");
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0", "--port", port],
  { stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.kill(signal));
const [result] = await once(server, "close");
process.exitCode = result || 0;

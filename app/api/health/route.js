import { database } from "../../../lib/database.mjs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const [row] =
      await database()`select count(*)::int as count from public.starter_note where id = 1`;
    if (row.count !== 1) throw new Error();
    return Response.json(
      {
        ok: true,
        starterId: "hostlittle-nextjs-postgres-v1",
        runtime: "nodejs",
        database: "connected",
        migration: "001_note",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { ok: false, error: "Database or migration unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

import { database } from "../../../lib/database.mjs";
import { parseNote, sameOrigin } from "../../../lib/note.mjs";
export const dynamic = "force-dynamic";
const json = (body, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function GET() {
  try {
    const [note] =
      await database()`select body, revision::text, updated_at from public.starter_note where id = 1`;
    return note ? json({ note }) : json({ error: "Run the starter migration." }, 503);
  } catch {
    return json({ error: "Database unavailable. Try again shortly." }, 503);
  }
}
export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: "Request origin rejected." }, 403);
  let body;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Enter a note." }, 400);
    const chunks = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 4096) {
          await reader.cancel();
          return json({ error: "Note request too large." }, 413);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    body = parseNote(JSON.parse(Buffer.concat(chunks).toString("utf8")).body);
  } catch {
    return json({ error: "Enter a note between 1 and 280 characters." }, 400);
  }
  try {
    const [note] =
      await database()`update public.starter_note set body = ${body}, revision = revision + 1, updated_at = now() where id = 1 returning body, revision::text, updated_at`;
    return note ? json({ note }) : json({ error: "Run the starter migration." }, 503);
  } catch {
    return json({ error: "Note could not be saved. Try again." }, 503);
  }
}

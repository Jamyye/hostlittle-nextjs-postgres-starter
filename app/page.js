"use client";
import { useEffect, useState } from "react";
export default function Page() {
  const [note, setNote] = useState(null),
    [body, setBody] = useState(""),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/note", { signal: abort.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setNote(data.note);
        setBody(data.note.body);
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setError("The note could not be loaded. Refresh to try again.");
      });
    return () => abort.abort();
  }, []);
  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setNote(data.note);
    } catch {
      setError("The note could not be saved. Try again.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <main>
      <h1>Demo note</h1>
      <p>A shared sample note stored in Postgres. Use test data only.</p>
      {error && <p role="alert">{error}</p>}
      {!note && !error && <p role="status">Loading note…</p>}
      {note && (
        <form onSubmit={save}>
          <label htmlFor="note">Note</label>
          <textarea
            id="note"
            maxLength={280}
            required
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <button disabled={saving}>{saving ? "Saving…" : "Save note"}</button>
          <p role="status">Saved revision {note.revision}</p>
        </form>
      )}
    </main>
  );
}

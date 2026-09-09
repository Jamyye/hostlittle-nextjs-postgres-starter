export function parseNote(value) {
  if (typeof value !== "string" || value.length < 1 || value.length > 280 || value.includes("\0"))
    throw new Error("Enter a note between 1 and 280 characters.");
  return value.toWellFormed();
}
export function sameOrigin(request) {
  try {
    return new URL(request.headers.get("origin")).host === request.headers.get("host");
  } catch {
    return false;
  }
}

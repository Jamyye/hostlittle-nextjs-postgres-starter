export function parseNote(value) {
  if (typeof value !== "string" || value.length < 1 || value.length > 280 || value.includes("\0"))
    throw new Error("Enter a note between 1 and 280 characters.");
  return value.toWellFormed();
}
export function sameOrigin(request) {
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site") return false;
    const origin = new URL(request.headers.get("origin"));
    if (!["https:", "http:"].includes(origin.protocol)) return false;
    // Host Little's viewer-request function overwrites this with the public host.
    // API Gateway uses an internal Host header for the origin connection.
    const host = request.headers.get("x-hostlittle-viewer-host") || request.headers.get("host");
    return Boolean(host) && origin.host === host;
  } catch {
    return false;
  }
}

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { randomUUID } from "node:crypto";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".md": "text/markdown; charset=utf-8"
};

export function requestId(req) {
  return req.headers["x-request-id"] || randomUUID();
}

export function securityHeaders(extra = {}) {
  return {
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    ...extra
  };
}

export function sendJson(res, status, body, id) {
  const payload = JSON.stringify(body);
  res.writeHead(status, securityHeaders({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-request-id": id
  }));
  res.end(payload);
}

export async function readJsonBody(req, maxBodyBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBodyBytes) {
      const err = new Error("Request body too large");
      err.status = 413;
      throw err;
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const err = new Error("Invalid JSON body");
    err.status = 400;
    throw err;
  }
}

export function createRateLimiter({ windowMs, max }) {
  const buckets = new Map();
  return function rateLimit(req) {
    const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    const key = forwarded || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }
    bucket.count += 1;
    return {
      allowed: bucket.count <= max,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000)
    };
  };
}

export async function serveStatic({ root, res, pathname, id }) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const absolute = resolve(join(root, safePath));
  if (!absolute.startsWith(root) || !existsSync(absolute)) {
    res.writeHead(404, securityHeaders({
      "content-type": "text/plain; charset=utf-8",
      "x-request-id": id
    }));
    res.end("Not found");
    return;
  }

  const ext = extname(absolute);
  res.writeHead(200, securityHeaders({
    "content-type": mimeTypes[ext] || "application/octet-stream",
    "cache-control": ext === ".html" ? "no-store" : "public, max-age=3600",
    "x-request-id": id
  }));
  res.end(await readFile(absolute));
}

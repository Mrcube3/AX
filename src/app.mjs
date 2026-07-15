import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { services } from "./catalog.mjs";
import { clampText, normalizeInput, quoteFor, reportFor, walletProfileFor } from "./engine.mjs";
import { createRateLimiter, readJsonBody, requestId, sendJson, serveStatic } from "./http.mjs";
import { checkOnchainOS } from "./onchainos.mjs";

export function createHandler({ config, store }) {
  const rateLimit = createRateLimiter({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax
  });

  async function handleApi(req, res, pathname, id) {
    if (pathname === "/api/health" && req.method === "GET") {
      const extra = process.env.VERCEL ? { cwd: process.cwd(), root: config.root } : {};
      return sendJson(res, 200, {
        ok: true,
        service: "ledgerpilot-asp",
        version: "0.1.0",
        env: config.nodeEnv,
        uptime: Math.round(process.uptime()),
        ...extra
      }, id);
    }

    if (pathname === "/api/services" && req.method === "GET") {
      return sendJson(res, 200, { services }, id);
    }

    if (pathname === "/api/integrations/onchainos" && req.method === "GET") {
      return sendJson(res, 200, await checkOnchainOS(), id);
    }

    if (pathname === "/api/listing" && req.method === "GET") {
      const listing = JSON.parse(await readFile(join(config.root, "okx-asp-listing.json"), "utf8"));
      return sendJson(res, 200, listing, id);
    }

    if ((pathname === "/api/quote" || pathname === "/api/report") && req.method === "POST") {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const input = normalizeInput(body, config.maxOrderChars);
      const payload = pathname === "/api/quote" ? quoteFor(input) : reportFor(input);
      return sendJson(res, 200, payload, id);
    }

    if (pathname === "/api/wallet/inspect" && req.method === "POST") {
      const body = await readJsonBody(req, config.maxBodyBytes);
      return sendJson(res, 200, walletProfileFor({ wallet: clampText(body.wallet, 80) }), id);
    }

    if (pathname === "/api/orders" && req.method === "POST") {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const input = normalizeInput(body, config.maxOrderChars);
      const report = reportFor(input);
      const order = {
        id: randomUUID(),
        status: "quoted",
        createdAt: new Date().toISOString(),
        input,
        report
      };
      await store.create(order);
      return sendJson(res, 201, order, id);
    }

    if (pathname === "/api/orders" && req.method === "GET") {
      const orders = await store.list();
      return sendJson(res, 200, { orders: orders.slice(-50).reverse() }, id);
    }

    const orderMatch = pathname.match(/^\/api\/orders\/([0-9a-f-]{36})$/i);
    if (orderMatch && req.method === "GET") {
      const order = await store.get(orderMatch[1]);
      if (!order) return sendJson(res, 404, { error: "Order not found" }, id);
      return sendJson(res, 200, order, id);
    }

    return sendJson(res, 404, { error: "Not found" }, id);
  }

  return async function handler(req, res) {
    const id = requestId(req);
    const startedAt = Date.now();
    try {
      const limited = rateLimit(req);
      if (!limited.allowed) {
        res.setHeader("retry-after", String(limited.retryAfter));
        return sendJson(res, 429, { error: "Rate limit exceeded" }, id);
      }
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url.pathname, id);
      } else if (req.method === "GET" || req.method === "HEAD") {
        await serveStatic({ root: config.root, res, pathname: url.pathname, id });
      } else {
        sendJson(res, 405, { error: "Method not allowed" }, id);
      }
    } catch (error) {
      sendJson(res, error.status || 500, { error: error.message || "Internal server error" }, id);
    } finally {
      if (!req.url?.startsWith("/assets/")) {
        console.log(JSON.stringify({
          requestId: id,
          method: req.method,
          path: req.url,
          statusCode: res.statusCode,
          durationMs: Date.now() - startedAt
        }));
      }
    }
  };
}

export function createApp({ config, store }) {
  const handler = createHandler({ config, store });
  return createServer(handler);
}

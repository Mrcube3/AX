import { config } from "../src/config.mjs";
import { createHandler } from "../src/app.mjs";
import { OrderStore } from "../src/store.mjs";

let handler;

export default async function vercelHandler(req, res) {
  try {
    if (!handler) {
      const store = new OrderStore(config.dataDir);
      await store.init();
      handler = createHandler({ config, store });
    }
    await handler(req, res);
  } catch (err) {
    console.error("Vercel handler error:", err);
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: err.message, stack: process.env.VERCEL ? undefined : err.stack }));
  }
}

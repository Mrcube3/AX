import { config } from "../src/config.mjs";
import { createHandler } from "../src/app.mjs";
import { OrderStore } from "../src/store.mjs";

const store = new OrderStore(config.dataDir);
await store.init();
const handler = createHandler({ config, store });

export default async function vercelHandler(req, res) {
  await handler(req, res);
}

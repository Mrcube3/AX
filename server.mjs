import { config } from "./src/config.mjs";
import { createApp } from "./src/app.mjs";
import { OrderStore } from "./src/store.mjs";

const store = new OrderStore(config.dataDir);
await store.init();

const server = createApp({ config, store });

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${config.port} is already in use. Set PORT to another value.`);
    process.exit(1);
  }
  if (error.code === "EPERM") {
    console.error(`Permission denied binding ${config.host}:${config.port}. Check local network permissions or use an allowed port.`);
    process.exit(1);
  }
  console.error(error);
  process.exit(1);
});

server.listen(config.port, config.host, () => {
  console.log(`LedgerPilot listening on http://${config.host}:${config.port}`);
});

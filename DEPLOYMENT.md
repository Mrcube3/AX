# Deployment

LedgerPilot is dependency-free Node.js. It can run on any host that supports Node 20+.

## Local

```bash
cd /Users/cube/Documents/bicode
PORT=8080 node server.mjs
```

Open:

```text
http://127.0.0.1:8080/
```

## Environment

```bash
HOST=0.0.0.0
PORT=8080
NODE_ENV=production
DATA_DIR=.data
MAX_BODY_BYTES=1000000
MAX_ORDER_CHARS=10000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
```

## Production Checklist

- Run behind HTTPS.
- Set `NODE_ENV=production`.
- Persist `DATA_DIR` on durable storage or replace `OrderStore` with a managed database.
- Keep all API keys server-side only.
- Do not expose wallet secrets, private keys, seed phrases, or payment credentials to the browser.
- Complete OKX.AI A2A registration using `ONCHAIN_OS_PROMPTS.md`.

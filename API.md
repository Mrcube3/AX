# LedgerPilot Backend API

The backend is dependency-free Node.js and serves both the UI and JSON API.

## Run

```bash
node server.mjs
```

Optional environment variables:

```bash
HOST=127.0.0.1
PORT=8080
MAX_BODY_BYTES=1000000
MAX_ORDER_CHARS=10000
DATA_DIR=.data
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
```

## Endpoints

### `GET /api/health`

Returns service status and uptime.

### `GET /api/services`

Returns the production service catalog.

### `GET /api/listing`

Returns `okx-asp-listing.json`.

### `GET /api/integrations/onchainos`

Checks whether the `onchainos` CLI is installed and can run preflight.

### `POST /api/quote`

Request:

```json
{
  "serviceId": "wallet-risk-triage",
  "speed": "standard",
  "wallet": "0x8F...92A1",
  "order": "Review my wallet before I move funds into X Layer DeFi."
}
```

Response:

```json
{
  "serviceId": "wallet-risk-triage",
  "serviceName": "Wallet Risk Triage",
  "escrowQuote": 25,
  "currency": "USDT",
  "eta": "30m",
  "risk": "Medium",
  "clarity": 92
}
```

### `POST /api/report`

Returns quote data plus delivery findings.

### `POST /api/wallet/inspect`

Returns a deterministic wallet readiness summary. The current implementation does not call external chain APIs.

Request:

```json
{
  "wallet": "0x742d...44e"
}
```

Response:

```json
{
  "wallet": "0x742d...44e",
  "validFormat": true,
  "network": "X Layer / EVM",
  "exposure": "Medium",
  "openApprovals": 2,
  "bridgeReady": true,
  "status": "Ready",
  "nextAction": "Generate a report and submit the order."
}
```

### `POST /api/orders`

Creates a quoted order and stores it in the configured `DATA_DIR`.

### `GET /api/orders`

Returns the latest 50 quoted orders.

### `GET /api/orders/:id`

Returns one quoted order.

## API Keys

No API key is required for the current backend. It does not call external providers.

Future integrations should use server-side environment variables only:

- `OKX_AGENT_ID` after A2A ASP registration.
- `OKX_API_KEY` only if OKX exposes a required API credential for the chosen integration.
- Wallet/risk data provider keys if you add live on-chain enrichment.

Do not put keys in `finance-copilot-asp.html`.

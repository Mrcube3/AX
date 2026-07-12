# LedgerPilot Production Readiness

## Current Build

The current build includes a production-style front end and dependency-free Node.js backend for presenting and operating the LedgerPilot ASP workflow:

- Service selection
- Escrow quote calculation
- Order intake
- Delivery summary
- Listing copy export
- JSON API for services, quotes, reports, health, and listing metadata
- File-backed quoted order storage
- Request IDs, structured logs, security headers, and basic rate limiting

It does not require an API key to run.

## Backend

Run with:

```bash
node server.mjs
```

The backend serves the app and exposes the endpoints documented in `API.md`.

Request limits are configurable with `MAX_BODY_BYTES` and `MAX_ORDER_CHARS`. They should not be removed entirely in production; keeping explicit limits prevents accidental memory abuse and malformed oversized requests.

`DATA_DIR` stores quoted orders as JSONL. For higher scale, replace `OrderStore` with a managed database while keeping the same API contract.

## Required For OKX.AI A2A Launch

- Onchain OS installed
- Agentic Wallet login
- OKX Agent Identity
- A2A ASP registration
- OKX.AI listing approval

Real wallet login requires the OKX Onchain OS CLI.

The backend exposes `GET /api/integrations/onchainos` to check CLI readiness. When the CLI is installed and preflight succeeds, the UI will show wallet login as ready.

## Required For Future A2MCP Launch

- x402-compatible paid endpoint
- OKX Payment SDK integration
- Server-side wallet/risk data providers
- Rate limiting and request logging
- Payment settlement testing

## Secrets Policy

Do not place private keys, API keys, wallet secrets, or payment credentials in `finance-copilot-asp.html`. Any future integrations should use a server-side service with environment variables.

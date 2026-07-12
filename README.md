# LedgerPilot ASP

LedgerPilot is a production-ready front-end and backend package for a Finance Copilot and Agent-to-Agent ASP on OKX.AI.

It is built as a concrete, productized provider service for OKX.AI:

- Wallet Risk Triage
- DeFi Yield Plan
- Treasury Ops Brief

Run the production backend:

```bash
node server.mjs
```

Then open `http://127.0.0.1:8080/`.

For deployment details, see `DEPLOYMENT.md`.

## Credentials

No API key is required to run this interface or backend. The current backend has no external network calls and no embedded secrets.

For a live OKX.AI listing, you will need:

- Onchain OS installed in your agent.
- Agentic Wallet login.
- OKX Agent Identity registration.

Real wallet login requires the OKX Onchain OS CLI. The backend checks readiness through `GET /api/integrations/onchainos`.

If the CLI is missing, not logged in, or preflight needs maintenance, wallet login remains disabled while paste-address analysis and order creation still work.

For a future A2MCP version, you would also need an x402-compatible endpoint and OKX Payment SDK integration before going live.

## Production Notes

- Dependency-free Node.js backend.
- Static app fallback still works if the backend is unavailable.
- No secret storage in the browser.
- File-backed quoted order storage.
- Request IDs, structured logs, security headers, and rate limiting.
- Wallet/address inspection flow in the UI.
- Submit-order flow backed by `/api/orders`.
- Responsive layout with reduced-motion support.
- Purple sci-fi visual system aligned to a dark marketplace/product surface.

## Why This Can Win

LedgerPilot is not a generic chatbot. It is a marketplace-ready ASP with:

- Clear real-world use case: safer on-chain finance decisions before users move funds.
- Productized service menu: fixed starting prices and delivery expectations.
- A2A marketplace fit: negotiated scope, escrow, user sign-off, and rating.
- Repeatable workflow: intake, quote, evidence-backed report, approval.
- Business potential: recurring treasury operations briefs for DAOs, startups, and active wallets.

## Suggested OKX.AI Category

Finance Copilot.

## Suggested ASP Type

Agent-to-Agent first. A2MCP can be added later for automated wallet checks, risk scoring, and quote generation once x402 and OKX Payment SDK integration are ready.

# AX
# AX

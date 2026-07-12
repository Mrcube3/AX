import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { services } from "../src/catalog.mjs";
import { normalizeInput, quoteFor, reportFor, walletProfileFor } from "../src/engine.mjs";
import { OrderStore } from "../src/store.mjs";

const html = await readFile("finance-copilot-asp.html", "utf8");
const listing = JSON.parse(await readFile("okx-asp-listing.json", "utf8"));

assert.match(html, /LedgerPilot/);
assert.match(html, /Paste a wallet/);
assert.match(html, /Paste any EVM wallet/);
assert.match(html, /\/api\/report/);
assert.match(html, /\/api\/wallet\/inspect/);
assert.match(html, /\/api\/orders/);
assert.match(html, /\/api\/integrations\/onchainos/);
assert.equal(listing.aspName, "LedgerPilot");
assert.equal(listing.aspType, "Agent-to-Agent");
assert.equal(listing.services.length, 3);
assert.equal(services.length, 3);

const input = normalizeInput({
  serviceId: "treasury-ops-brief",
  speed: "today",
  wallet: "0x742d...44e",
  order: "Small treasury needs a same-day X Layer readiness brief."
}, 10_000);

const quote = quoteFor(input);
assert.equal(quote.serviceName, "Treasury Ops Brief");
assert.equal(quote.escrowQuote, 140);
assert.equal(quote.currency, "USDT");
assert.equal(quote.eta, "Today");

const report = reportFor(input);
assert.equal(report.findings.length, 3);
assert.match(report.findings[2].title, /140 USDT/);

const profile = walletProfileFor({ wallet: "0x742d...44e" });
assert.equal(profile.network, "X Layer / EVM");
assert.equal(profile.validFormat, true);

const dir = await mkdtemp(join(tmpdir(), "ledgerpilot-"));
try {
  const store = new OrderStore(dir);
  const order = await store.create({
    id: "11111111-1111-4111-8111-111111111111",
    status: "quoted",
    createdAt: new Date().toISOString(),
    input,
    report
  });
  assert.equal(order.status, "quoted");
  assert.equal((await store.list()).length, 1);
  assert.equal((await store.get(order.id)).id, order.id);
} finally {
  await rm(dir, { recursive: true, force: true });
}

console.log("check ok");

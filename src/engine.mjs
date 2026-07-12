import { getService, normalizeSpeed, speedMultipliers } from "./catalog.mjs";

export function clampText(value, max) {
  return String(value || "").trim().slice(0, max);
}

export function clarityScore(order) {
  const length = String(order || "").trim().length;
  if (length >= 170) return 96;
  if (length >= 90) return 92;
  return 84;
}

export function normalizeInput(body, maxOrderChars) {
  return {
    serviceId: clampText(body.serviceId, 80),
    speed: normalizeSpeed(clampText(body.speed, 20)),
    wallet: clampText(body.wallet, 80),
    order: clampText(body.order, maxOrderChars)
  };
}

export function quoteFor(input) {
  const service = getService(input.serviceId);
  const speed = normalizeSpeed(input.speed);
  const multiplier = speedMultipliers[speed];
  return {
    serviceId: service.id,
    serviceName: service.name,
    escrowQuote: Math.round(service.price * multiplier),
    currency: "USDT",
    eta: speed === "today" ? "Today" : speed === "priority" ? "1h" : service.eta,
    risk: service.risk,
    clarity: clarityScore(input.order)
  };
}

export function reportFor(input) {
  const quote = quoteFor(input);
  const wallet = clampText(input.wallet || "provided wallet", 80);
  const cap = quote.serviceId === "treasury-ops-brief" ? "weekly treasury limits" : "15% first allocation";
  return {
    ...quote,
    wallet,
    findings: [
      {
        label: "Finding",
        title: `${quote.serviceName} for ${wallet}`,
        body: "Primary risk is approval exposure and concentration before expanding X Layer activity."
      },
      {
        label: "Action",
        title: `Set ${cap}`,
        body: "Revoke stale approvals, stage capital movement, and require evidence before release."
      },
      {
        label: "Escrow delivery",
        title: `${quote.escrowQuote} ${quote.currency} package / ${quote.eta} ETA`,
        body: "Deliver a concise report with risk table, action list, assumptions, and evidence links for sign-off."
      }
    ]
  };
}

export function walletProfileFor(input) {
  const wallet = clampText(input.wallet || "", 80);
  const normalized = wallet.toLowerCase();
  const isEvm = /^0x[a-f0-9]{40}$/i.test(wallet);
  const isPreview = /^0x[a-f0-9]{2,}\.{3}[a-f0-9]{2,}$/i.test(wallet);
  const checksum = [...normalized].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const exposure = checksum % 3 === 0 ? "High" : checksum % 3 === 1 ? "Medium" : "Low";
  const approvals = checksum % 5;
  const bridgeReady = approvals <= 2 && exposure !== "High";

  return {
    wallet: wallet || "not connected",
    validFormat: isEvm || isPreview,
    network: "X Layer / EVM",
    exposure,
    openApprovals: approvals,
    bridgeReady,
    status: bridgeReady ? "Ready" : "Review",
    nextAction: bridgeReady
      ? "Generate a report and submit the order."
      : "Run risk triage before moving funds."
  };
}

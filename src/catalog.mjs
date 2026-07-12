export const services = [
  {
    id: "wallet-risk-triage",
    name: "Wallet Risk Triage",
    price: 25,
    eta: "30m",
    risk: "Medium",
    description: "Approvals, exposure, bridge readiness, liquidation risk, and immediate actions."
  },
  {
    id: "defi-yield-plan",
    name: "DeFi Yield Plan",
    price: 45,
    eta: "2h",
    risk: "Conservative",
    description: "Pool comparison, net-yield assumptions, liquidity notes, and allocation planning."
  },
  {
    id: "treasury-ops-brief",
    name: "Treasury Ops Brief",
    price: 80,
    eta: "Same day",
    risk: "Team",
    description: "Stablecoin mix, inflows, outflows, controls, runway, and next-week actions."
  }
];

export const speedMultipliers = {
  standard: 1,
  priority: 1.35,
  today: 1.75
};

export function getService(serviceId) {
  return services.find((service) => service.id === serviceId) || services[0];
}

export function normalizeSpeed(value) {
  return Object.hasOwn(speedMultipliers, value) ? value : "standard";
}

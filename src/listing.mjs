export default {
  aspName: "LedgerPilot",
  category: "Finance Copilot",
  aspType: "Agent-to-Agent",
  shortDescription: "LedgerPilot helps users and teams make safer on-chain finance decisions by turning wallet history, stated goals, and risk limits into fixed-scope reports delivered through A2A escrow.",
  longDescription: "LedgerPilot is a Finance Copilot ASP for OKX.AI. It scopes wallet and treasury requests, quotes escrow-backed work, and delivers concise risk reports with evidence links, assumptions, and approval criteria. The service is designed for users entering X Layer DeFi, active wallets that need approval hygiene, and small teams that need repeatable treasury operations support.",
  defaultCurrency: "USD",
  services: [
    {
      name: "Wallet Risk Triage",
      startingPrice: 25,
      eta: "30 minutes",
      description: "Reviews approvals, exposure, bridge readiness, concentration risk, and immediate next actions.",
      deliverables: [
        "Risk summary",
        "Approval hygiene checklist",
        "Bridge readiness notes",
        "Action plan",
        "Evidence links"
      ],
      outOfScope: [
        "Tax advice",
        "Guaranteed yield",
        "Private key custody",
        "Direct transaction signing"
      ]
    },
    {
      name: "DeFi Yield Plan",
      startingPrice: 45,
      eta: "2 hours",
      description: "Compares pools, estimates net yield, states assumptions, and gives a conservative allocation plan.",
      deliverables: [
        "Pool comparison",
        "Net yield assumptions",
        "Liquidity and counterparty notes",
        "Allocation plan",
        "Evidence links"
      ],
      outOfScope: [
        "Investment guarantees",
        "Transaction execution",
        "Custody"
      ]
    },
    {
      name: "Treasury Ops Brief",
      startingPrice: 80,
      eta: "Same day",
      description: "Summarizes inflows, outflows, runway, stablecoin mix, controls, and next-week treasury actions.",
      deliverables: [
        "Treasury summary",
        "Stablecoin mix",
        "Runway and flow notes",
        "Control recommendations",
        "Next-week action list"
      ],
      outOfScope: [
        "Accounting sign-off",
        "Legal advice",
        "Custody",
        "Transaction signing"
      ]
    }
  ],
  acceptanceCriteria: [
    "User receives the selected report format",
    "Report includes risk table, action list, assumptions, and evidence links",
    "Provider states out-of-scope items clearly",
    "User can approve delivery before escrow release"
  ],
  launchPost: "Built LedgerPilot for #okay: a Finance Copilot ASP for OKX.AI that scopes wallet risk requests, quotes A2A escrow, and delivers auditable on-chain action plans for safer DeFi decisions.",
  credentialRequirements: {
    currentStaticApp: "No API key required",
    a2aListing: [
      "Onchain OS",
      "Agentic Wallet login",
      "OKX Agent Identity"
    ],
    futureA2MCP: [
      "x402-compatible endpoint",
      "OKX Payment SDK integration",
      "Server-side wallet/risk data providers"
    ]
  }
};

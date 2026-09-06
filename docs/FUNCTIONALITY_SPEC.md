# CoinAstra Sentinel — Functionality Specification (locked 2026-09-06)

**Source of truth** for product behavior. UI chrome follows Mohamed’s desktop/mobile mockups (`docs/mockups/`).

## Architecture
- **CoinAstra** = Crypto Intelligence Platform
- **Sentinel** = Security Intelligence Engine
- **AI** = Explanation, investigation, and automation only — never invents blockchain facts, prices-as-live, or risk scores

**Pipeline (required):**  
USER INPUT → ADDRESS ID → BLOCKCHAIN DATA → SECURITY DATA → **DETERMINISTIC RISK ENGINE** → EVIDENCE → AI ANALYSIS → USER RESPONSE

**Forbidden:** USER INPUT → AI invents risk score / moon signals / price prediction products.

**Killer loop:** Discover → Investigate → Simulate → Assess Risk → Monitor → Act

## Fail-closed rules
- Missing data ≠ safe. Label unknowns.
- DEMO / fixture data must be labeled DEMO.
- Evidence is measurable facts only (sources, raw fields). Scores come from the engine, not the LLM.

## AI response shape (every Sentinel AI answer)
1. **Verdict**
2. **Why** (3–5 strongest reasons)
3. **Evidence** (measurable facts only)
4. **Impact**
5. **Recommendation**
6. **Confidence** (High/Low + reason if data insufficient)

## Navigation (locked)
- **Dashboard**
- **Markets** — Market Overview, AI Market Intelligence, Whale Intelligence, DEX Intelligence
- **Sentinel** — Wallet Scanner, Token Scanner, Contract Scanner, Transaction Preview, Transaction Simulator, Approval Checker, Exposure Checker, AI Agent Firewall
- **Intelligence** — Risk Intel, Sentinel AI, Deployer Intelligence, Launchpad Intelligence, Threat Intelligence
- **Portfolio** — Overview, Holdings, Performance, Portfolio Security (and related)
- Plus: Alerts, Watchlist, Monitor, Policies, API, Settings, Pricing as shipped

## Core Sentinel surfaces (behavior intent)
| Surface | Intent |
|--------|--------|
| Wallet / Token / Contract scanners | Identify subject → pull chain + security data → engine findings + evidence → AI explain |
| Transaction Preview | Pre-sign risk: decode intent, approvals, value movement; evidence-backed |
| Transaction Simulator | Simulate outcomes without inventing; show what would change |
| **Approval Checker** | List active allowances (verify on-chain); flag unlimited / risky spenders; revoke guidance (no broadcast) |
| **Exposure Checker** | Holdings + approval-driven exposure; concentration / risky asset flags; evidence-backed |
| Monitor / Alerts / Watchlist | Ongoing watch on wallets/tokens/contracts; alert on risk changes |
| AI Agent Firewall | Policy gate for agent-driven txs / approvals |
| Risk / Threat / Deployer / Launchpad / Whale / DEX intel | Intelligence layers; security-linked where applicable |

## Pricing (locked)
- **Free** — 5 scans/day; basic Wallet/Token/Contract scanners + risk score + basic AI
- **Pro** — €19–29/month; unlimited scans, monitoring, alerts, portfolio security, tx analysis, advanced AI
- **Business** — €299+/month; API, bulk, webhooks, team accounts, custom policies
- **Enterprise** — custom

## Visual
- Dark navy `#030712`, electric purple accents, left sidebar (desktop), mobile bottom nav: Home | Markets | Scan | Alerts | More (Scan central)
- Pixel-match Mohamed mockups; DEMO labels preserved

## Build order (locked 2026-09-06)
1. Pixel fidelity (done through PR #12)
2. **Approval Checker + Exposure Checker** (real evidence-backed behavior; no dead buttons)
3. Tx Simulator
4. Monitor / Alerts depth
5. Later: Markets/Portfolio live data, Agent Firewall, API, Enterprise, payments

## Deploy blockers (owner: Mohamed)
Vercel ↔ GitHub (`kalifmoh24` / CoinAstra-Sentinel), Postgres `DATABASE_URL`, optional Etherscan/Alchemy/OpenAI keys, DNS for `coinastra.io`.

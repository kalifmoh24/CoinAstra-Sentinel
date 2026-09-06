# CoinAstra Sentinel

**Know Before You Sign.** — The security intelligence layer for crypto ([coinastra.io](https://coinastra.io)).

Phase 2.5: product depth on scan results — wallet activity timeline, finding recommendations, dangerous-permissions panel, token/contract subject header. Builds on Phase 2 scanners, Postgres, and mobile/PWA basics.

> AI never invents blockchain facts or the risk score. Missing data surfaces as **Insufficient data**. Demo fixtures are labeled **DEMO**. Scores are analytical assessments, not financial/security guarantees. Transaction scanner is **analysis only** — never signs or executes.

## Architecture

data → deterministic risk engine → evidence → AI explanation → result page.

### Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Prisma + PostgreSQL (Neon or managed)
- Modular providers + chain adapters
- Web app manifest + icons (Add to Home Screen)
- Vercel-ready

## Quick start

1. Copy .env.example to .env
2. Set DATABASE_URL to a PostgreSQL URL (Neon recommended)
3. Install deps, push Prisma schema, run the Next.js dev server
4. Open http://localhost:3000

With DEMO_MODE=true (or no explorer keys), synthetic fixtures power scans and are labeled DEMO. Persistence still requires reachable Postgres.

### Environment

- DEMO_MODE — force demo fixtures
- ETHERSCAN_API_KEY — live Ethereum explorer data
- ALCHEMY_API_KEY — reserved for RPC enrichment
- OPENAI_API_KEY — optional LLM explanations
- DATABASE_URL — PostgreSQL connection string (required)
- NEXT_PUBLIC_APP_URL — canonical app URL

## Product surface

### Locked nav map (CoinAstra IA)

| Nav label | Route | Status |
|-----------|-------|--------|
| Dashboard | `/dashboard` | Beta stub |
| Markets | `/markets` | Coming soon |
| Portfolio | `/portfolio` | Coming soon |
| AI Intelligence | `/ai-intelligence` | Beta stub |
| Wallet Scanner | `/scan/wallet` (alias `/wallet`) | Live |
| Token Scanner | `/scan/token` | Live |
| Contract Scanner | `/scan/contract` | Live |
| Transaction Preview | `/scan/transaction` | Live |
| Risk Intel | `/risk-intel` | Beta stub |
| Alerts | `/alerts` | Coming soon |
| Watchlist | `/watchlist` | Coming soon |
| Exposure Checker | `/exposure-checker` | Beta stub |
| AI Security Analyst | `/ai-security-analyst` | Beta stub |
| Transaction Simulator | `/transaction-simulator` | Coming soon |
| Approval Checker | `/approval-checker` | Beta stub |
| AI Agent Firewall | `/ai-agent-firewall` | Coming soon |
| DEX Intelligence | `/dex-intelligence` | Coming soon |
| Launchpad Intelligence | `/launchpad-intelligence` | Coming soon |
| API / Integrations | `/api-integrations` | Beta stub |

Desktop: primary scanners + Dashboard/Risk Intel in the top bar; **More** opens the full IA drawer. Mobile: bottom bar (Dashboard, Wallet, Token, Tx, **More**) with the same full route list.

### Other routes

- `/` — Homepage + universal search + quick links
- `/scan/[id]` — Full result page
- `/pricing` — Free / Pro / Business stub (no payments) + “We don’t do this” strip
- `POST /api/scan` — Validate, rate-limit, optional type param, engine, AI, persist
- `GET /api/v1/{wallet,token,contract,transaction}/[id]` — API stubs
- `/manifest.webmanifest` — PWA manifest

`POST /api/scan` accepts `type: auto | wallet | token | contract | transaction`.

**Brand:** CoinAstra is the platform; Sentinel is the security engine. No AI BTC candle predictions / no generic signal spam. DEMO labels and disclaimers stay.

### Phase 2.5 result depth

- **Wallet activity timeline** — when provider/demo fixtures include tx history: date, amount, asset, from, to, risk level, contract interaction
- **Finding recommendations** — each critical/high finding shows a Recommendation line (engine field or id-mapped)
- **Dangerous permissions** — dedicated card on token/contract results for mint / pause / upgrade / blacklist / owner privilege findings
- **Token/contract subject header** — name, symbol, chain, verified, deployer when present in result metadata (no invented facts)

## Risk engine

- Wallet: age, tx count, high-risk interactions, mixer stub, rapid movement, new contracts, funding source, optional activity rows
- Token: contract checks plus symbol/decimals/supply, holder breadth, volume/price signals
- Contract: verified, age, proxy/upgradeable, owner (incl. renounced), mint/pause/blacklist/fee/selfdestruct ABI heuristics, honeypot hook, optional deployer
- Transaction: analysis-only banner, sensitive methods, approvals, value bands, parties/status evidence
- Bands: Very Low / Low / Moderate / High / Critical
- Categories: Security, Contract, Wallet, Liquidity, Ownership, Transaction
- Every finding includes evidence with reason and source

## Mobile and PWA

- Larger tap targets, sticky scan CTA above bottom nav, safe-area insets
- Bottom-friendly primary nav + More drawer listing all locked IA routes
- Responsive result cards
- Web manifest + icons + theme-color for Add to Home Screen (not a native store app)

## Free tier

5 scans/day keyed by cookie sentinel_rid with IP fallback via RateLimitBucket.

## Out of scope

Full multi-chain live data, monitoring/alerts, payments, browser extension, transaction execution / wallet signing.

## Deploy

**Vercel project name:** `coinastra-sentinel` (link `kalifmoh24/CoinAstra-Sentinel`).

### Ops checklist
1. Link the GitHub repo in Vercel (GitHub app must have access as `kalifmoh24`).
2. Set environment variables (Production / Preview as needed):
   - `DEMO_MODE` — `false` in production; `true` ok for preview soft-launch
   - `ETHERSCAN_API_KEY`, `ALCHEMY_API_KEY` — server-only (never `NEXT_PUBLIC_*`)
   - `OPENAI_API_KEY` — optional, server-only
   - `DATABASE_URL` — PostgreSQL URL (Neon or Vercel Postgres); required
   - `NEXT_PUBLIC_APP_URL` — `https://coinastra.io` in production
3. Provision Postgres, then run `npx prisma db push` (or migrate) against that `DATABASE_URL`.
4. Deploy from `main`. Build runs `prisma generate && next build`.
5. Add custom domain `coinastra.io` (+ `www` if desired) and apply the DNS records Vercel shows.
6. Smoke: homepage, a scan (live or labeled DEMO), persistence, no API keys in the client bundle.

Local/dev uses the same PostgreSQL provider (Neon free tier or Docker). SQLite is no longer supported.

## License

Proprietary — CoinAstra.

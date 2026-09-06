# CoinAstra Sentinel

**Know Before You Sign.** — The security intelligence layer for crypto ([coinastra.io](https://coinastra.io)).

Phase 1 MVP: universal search → provider data → **deterministic risk engine** → evidence → Sentinel AI explanation.

> AI never invents blockchain facts or the risk score. Missing data surfaces as **Insufficient data**. Demo fixtures are labeled **DEMO**. Scores are analytical assessments, not financial/security guarantees.

## Architecture

```
Blockchain / provider data
        ↓
Deterministic risk engine (0–100 + band + categories + evidence)
        ↓
Sentinel AI explanation (templated, or OpenAI if keyed)
        ↓
User (result page)
```

### Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Prisma (SQLite local/demo; Postgres via `DATABASE_URL`)
- Modular providers + chain adapters (`ethereum` implemented; others stubbed)
- Vercel-ready

## Quick start

```bash
cp .env.example .env
# DEMO_MODE=true and DATABASE_URL="file:./dev.db" are enough for local demo

npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), paste any EVM address or 66-char tx hash, **Scan with Sentinel**.

With `DEMO_MODE=true` (or no explorer keys), synthetic fixtures power an end-to-end scan and are labeled **DEMO**.

### Environment

| Variable | Purpose |
|----------|---------|
| `DEMO_MODE` | Force demo fixtures |
| `ETHERSCAN_API_KEY` | Live Ethereum explorer data |
| `ALCHEMY_API_KEY` | Reserved for RPC enrichment |
| `OPENAI_API_KEY` | Optional LLM explanations |
| `DATABASE_URL` | Postgres URL or `file:./dev.db` |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL |

## Product surface

| Route | Description |
|-------|-------------|
| `/` | Homepage + universal search |
| `/scan/[id]` | Full result (score, bands, categories, findings, AI, disclaimer) |
| `/pricing` | Free / Pro / Business stub (no payments) |
| `POST /api/scan` | Validate, rate-limit (5/day), providers, engine, AI, persist |
| `GET /api/v1/{wallet,token,contract,transaction}/[id]` | Phase 1 stubs |

## Risk engine (Phase 1 subset)

- **Wallet:** age, tx count, high-risk interactions, mixer stub, rapid movement, new contracts, funding source
- **Token/Contract:** verified, age, proxy/upgradeable, owner privileges, honeypot heuristic hook, mint/pause/blacklist ABI heuristics
- **Bands:** Very Low / Low / Moderate / High / Critical
- **Categories:** Security, Contract, Wallet, Liquidity, Ownership, Transaction
- Every finding includes `evidence: { reason, source, raw? }`

## Free tier

5 scans/day keyed by cookie (`sentinel_rid`) with IP fallback (`RateLimitBucket` in Prisma).

## Out of scope (scaffolded only)

Full multi-chain, monitoring/alerts, payments, browser extension, transaction execution.

## Deploy

Connect the GitHub repo to Vercel, set env vars (use Postgres `DATABASE_URL` in production), deploy.

## License

Proprietary — CoinAstra.

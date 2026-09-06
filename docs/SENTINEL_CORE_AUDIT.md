# SENTINEL CORE AUDIT

Commit audited: `e4d47f8` (main)

## 1. What already works

- Next.js 15 App Router + TypeScript compiles.
- Prisma models: `Scan`, `RateLimitBucket`, `WatchItem`, `AlertEvent`.
- `/api/scan` POST → `runScan` → providers → `runRiskEngine` → persist `resultJson` → existing `/scan/[id]` UI.
- Input detection: EVM address vs tx hash (`src/lib/detect.ts`).
- `identifyInput()` classifies wallet / contract / tx / CoinGecko market symbol.
- Ethereum adapter uses Etherscan when `ETHERSCAN_API_KEY` is set.
- Public RPC helpers: `eth_getCode`, `eth_getBalance`, `eth_call`, ERC-20 meta (`src/lib/live/rpc.ts`).
- Risk engine is deterministic (wallet/token/contract/tx analyzers + score bands). Security vendor fields fail closed (`null` = insufficient data).
- X-Ray uses live CoinGecko + optional RPC bytecode (out of Core scope).

## 2. What is mocked

- `DEMO_MODE=true` returns labeled fixtures (`src/lib/demo/fixtures`).
- Non-Ethereum chains previously returned DEMO fixtures; Core now returns empty unsupported records instead.
- `securityProvider` live path returns all-null intel (no Chainalysis/TRM key).
- Dashboard stat cards still include demo-looking numbers in the page component.
- Alert badge “8” in the header is visual, not a live count.

## 3. What is incomplete / incorrect

- Wallet token holdings / approvals / token transfers are not populated without extra explorer modules.
- Transaction simulation and approval checker remain later phases.
- Other chains (Base, Arb, Polygon, BSC, Solana) are unsupported stubs (no invented data).

## 4. APIs already connected

| Source | Used for | Key |
| --- | --- | --- |
| Etherscan `api.etherscan.io` | txlist, balance, source, creation, tx by hash | `ETHERSCAN_API_KEY` optional |
| Public ETH RPC + optional `ETH_RPC_URL` / Alchemy | code, balance, tx, receipt | optional |
| CoinGecko public API | X-Ray + symbol search + token market | none |
| OpenAI | AI explanation after engine | `OPENAI_API_KEY` optional |
| Postgres / Neon | Scan persistence | `DATABASE_URL` |

## 5. Blockchain data missing (Ethereum)

- Full ERC-20 transfer list and token balances.
- Allowance inventory.
- Internal txs, NFT transfers.
- Confirmed sanctions / phishing (vendor).
- DEX liquidity depth, holders, whales.

## 6. Database requirements

Existing `Scan` row is enough for Core. engineVersion stays in JSON.

## 7. API requirements

- `POST /api/scan` — scanner.
- `POST /api/identify` — classify input before scan.

## 8. Security issues

- Never request seed phrases / private keys.
- `clientIp` stored on Scan — treat as PII.
- Public RPCs can rate-limit; fail closed.
- Rate limit 5 scans/day via cookie `sentinel_rid`.

## 9. Implementation order

1. Fail-closed Ethereum adapter.
2. `hasCode` via `eth_getCode`.
3. Identify API + token vs contract via ERC-20 meta.
4. Wire existing `TopSearch`.
5. CoinGecko contract market lookup.
6. Test real addresses. Do not expand chains yet.

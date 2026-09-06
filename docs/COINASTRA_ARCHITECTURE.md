# CoinAstra Sentinel — Architecture Audit

**Date:** 2026-09-06  
**Rule:** Fail closed. AI never invents scores, balances, or findings. DEMO fixtures only when `DEMO_MODE=true` and labeled.

---

## 1. Current architecture

```
Browser (Next.js App Router + Tailwind)
    ↓  POST /api/scan | GET /api/xray | GET/POST /api/watchlist
API routes (src/app/api)
    ↓
Providers (src/lib/providers) + live RPC (src/lib/live/rpc.ts)
    ↓
Deterministic risk engine (src/lib/engine)
    ↓
AI explanation (src/lib/ai/explain.ts) — optional OpenAI, else template
    ↓
PostgreSQL via Prisma (Scan, WatchItem, AlertEvent, RateLimitBucket)
```

**Frontend:** Next.js 15 App Router, React 19, TypeScript, Tailwind, lucide-react, Recharts.  
**Backend:** Next.js Route Handlers (no separate Nest/Express).  
**Auth:** Cookie `sentinel_rid` (anonymous owner key). No user accounts, OAuth, or wallet-connect login.  
**State:** Server Components + client forms. No Redux/Zustand.  
**Charts:** Recharts + custom SVG (`Sparkline`, `RiskRadar`, `PortfolioDonut`).  
**AI:** `explainFindings` uses OpenAI Chat Completions only if `OPENAI_API_KEY` is set; otherwise a template that cites engine findings.

### Pipeline (locked)

USER INPUT → IDENTIFY → BLOCKCHAIN / MARKET DATA → DETERMINISTIC ENGINE → EVIDENCE → AI TEXT → UI

See FUNCTIONALITY_MATRIX.md for feature status.

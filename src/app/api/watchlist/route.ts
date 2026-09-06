import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { OWNER_COOKIE } from "@/lib/live/session";
import { deleteWatchItem, listWatchItems, upsertWatchItem } from "@/lib/live/watch";

const Body = z.object({
  subject: z.string().min(4).max(128).optional(),
  subjectType: z.enum(["wallet", "token", "contract"]).optional(),
  chain: z.string().optional(),
  label: z.string().max(80).optional(),
  note: z.string().max(200).optional(),
  lastScore: z.number().optional(),
  lastBand: z.string().optional(),
  lastScanId: z.string().optional(),
  id: z.string().optional(),
  action: z.enum(["add", "remove"]).optional(),
});

async function ownerFromRequest(req: NextRequest): Promise<{ key: string; minted: string | null }> {
  const existing = req.cookies.get(OWNER_COOKIE)?.value;
  if (existing) return { key: existing, minted: null };
  const minted = crypto.randomUUID();
  return { key: minted, minted };
}

function withCookie(res: NextResponse, minted: string | null) {
  if (minted) {
    res.cookies.set(OWNER_COOKIE, minted, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

export async function GET(req: NextRequest) {
  const { key, minted } = await ownerFromRequest(req);
  const items = await listWatchItems(key);
  return withCookie(NextResponse.json({ items }), minted);
}

export async function POST(req: NextRequest) {
  const { key, minted } = await ownerFromRequest(req);
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid watchlist payload" }, { status: 400 });
  }
  const body = parsed.data;
  if (body.action === "remove" && body.id) {
    await deleteWatchItem(key, body.id);
    return withCookie(NextResponse.json({ ok: true }), minted);
  }
  if (!body.subject || !body.subjectType) {
    return NextResponse.json({ error: "subject and subjectType required" }, { status: 400 });
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(body.subject)) {
    return NextResponse.json({ error: "Watchlist expects an EVM address" }, { status: 400 });
  }
  try {
    const item = await upsertWatchItem({
      ownerKey: key,
      subject: body.subject.toLowerCase(),
      subjectType: body.subjectType,
      chain: body.chain || "ethereum",
      label: body.label,
      note: body.note,
      lastScore: body.lastScore ?? null,
      lastBand: body.lastBand ?? null,
      lastScanId: body.lastScanId ?? null,
    });
    return withCookie(NextResponse.json({ item }), minted);
  } catch (err) {
    console.error("watchlist upsert", err);
    return NextResponse.json(
      { error: "Could not persist watch item. Run prisma db push against DATABASE_URL." },
      { status: 503 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { key, minted } = await ownerFromRequest(req);
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteWatchItem(key, id);
  return withCookie(NextResponse.json({ ok: true }), minted);
}

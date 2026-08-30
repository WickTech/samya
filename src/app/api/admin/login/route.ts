import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
} from "@/lib/admin/config";
import { checkCredentials } from "@/lib/admin/password";
import { createSessionToken } from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
  } | null;

  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  // Fixed cost regardless of outcome — blunts trivial timing / brute force.
  await new Promise((r) => setTimeout(r, 350));

  if (!email || !password || !checkCredentials(email, password)) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 },
    );
  }

  const token = await createSessionToken(email.trim().toLowerCase());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
  return res;
}

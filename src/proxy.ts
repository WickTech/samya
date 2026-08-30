import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE,
  ADMIN_HOME_PATH,
} from "@/lib/admin/config";
import { verifySessionToken } from "@/lib/admin/session";

/**
 * Gate for the entire private surface. Runs on the Edge before any admin
 * page or API route renders:
 *  - unauthenticated  -> redirect to the login page (or 401 for /api/admin)
 *  - authenticated on /admin/login -> bounce to the dashboard
 * Every admin response also gets X-Robots-Tag: noindex.
 */
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

function noindex(res: NextResponse): NextResponse {
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === ADMIN_LOGIN_PATH;
  const isAuthApi =
    pathname === "/api/admin/login" || pathname === "/api/admin/logout";

  if (isAuthApi) return NextResponse.next();

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (isLoginPage) {
    if (session) {
      return noindex(NextResponse.redirect(new URL(ADMIN_HOME_PATH, req.url)));
    }
    return noindex(NextResponse.next());
  }

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return noindex(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }
    const url = new URL(ADMIN_LOGIN_PATH, req.url);
    if (pathname !== ADMIN_HOME_PATH) url.searchParams.set("from", pathname);
    return noindex(NextResponse.redirect(url));
  }

  return noindex(NextResponse.next());
}

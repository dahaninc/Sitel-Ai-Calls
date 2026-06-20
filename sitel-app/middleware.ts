/**
 * Next.js Middleware — Auth Guard (Edge-safe)
 *
 * Checks for a Supabase session cookie without importing the SDK.
 * The SDK uses Node.js APIs (process.version) incompatible with the Edge Runtime.
 * Full auth verification happens inside each dashboard server component.
 */
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Check for Supabase session cookie (sb-<project>-auth-token)
  const hasSession = req.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

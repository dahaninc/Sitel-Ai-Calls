/**
 * Next.js Middleware — Auth Guard
 *
 * Runs on the Edge before every request to /dashboard/*.
 * Reads the Supabase session cookie server-side (no round-trip to Supabase).
 * Unauthenticated requests are redirected to /login instantly —
 * the dashboard page never renders, preventing flash-of-unauthorized-content.
 */
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Only guard /dashboard routes
  if (!req.nextUrl.pathname.startsWith("/dashboard")) return res;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options as Parameters<typeof res.cookies.set>[2])
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Redirect to login, preserving the intended URL so we can redirect back after login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

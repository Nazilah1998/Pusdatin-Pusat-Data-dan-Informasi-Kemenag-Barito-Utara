import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/maintenance"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/branding") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const hasSupabaseSession = request.cookies.has("sb-db-auth-token") ||
    request.cookies.has("sb-db-auth-token-code-verifier");

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path),
  );

  if (!hasSupabaseSession && !isPublic && pathname !== "/") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSupabaseSession && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

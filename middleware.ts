import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only process admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;

  // Allow access to login page for unauthenticated users
  if (pathname === "/admin/login") {
    if (isLoggedIn) {
      // Redirect logged-in users away from login page
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Allow unauthenticated users to see login page
    return NextResponse.next();
  }

  // Protect all other admin routes
  if (!isLoggedIn) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

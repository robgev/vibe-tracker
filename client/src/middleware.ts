import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token");
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/signin", "/signup"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Protected routes that require authentication
  const protectedRoutes = ["/habits", "/stats"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If accessing a protected route without auth, redirect to signin
  if (isProtectedRoute && !authToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // If accessing public route with auth, redirect to habits dashboard
  if (isPublicRoute && authToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/habits";
    return NextResponse.redirect(url);
  }

  // If accessing root with auth, redirect to habits
  if (pathname === "/" && authToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/habits";
    return NextResponse.redirect(url);
  }

  // If accessing root without auth, redirect to signin
  if (pathname === "/" && !authToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};

// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const verifyToken = async (token: string | undefined, secret: string | undefined) => {
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
  } catch {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const instituteToken = request.cookies.get("institute_token")?.value;
  const adminToken = request.cookies.get("admin_token")?.value;
  const nextAuthToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Institute-protected routes
  const instituteProtected =
    pathname.startsWith("/institute/dashboard") ||
    pathname.startsWith("/institute/event") ||
    pathname.startsWith("/institute/create-sub-event");

  if (instituteProtected && !pathname.startsWith("/institute/login")) {
    const payload = await verifyToken(instituteToken, process.env.JWT_SECRET);
    if (!payload) {
      return NextResponse.redirect(new URL("/institute/login", request.url));
    }
  }

  // Admin
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminPayload = await verifyToken(adminToken, process.env.ADMIN_JWT_SECRET);
    if (!adminPayload) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // User (next-auth) protected
  if (pathname.startsWith("/user/dashboard")) {
    if (!nextAuthToken) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/institute/dashboard/:path*",
    "/institute/event/:path*", 
    "/institute/create-sub-event/:path*",
    "/admin/:path*",
    "/user/dashboard/:path*",
  ],
};

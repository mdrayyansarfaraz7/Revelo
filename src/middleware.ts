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

  // INSTITUTE ROUTES (except login)
  if (pathname.startsWith("/institute") && pathname !== "/institute/login") {
    const payload = await verifyToken(instituteToken, process.env.JWT_SECRET);
    if (!payload) {
      return NextResponse.redirect(new URL("/institute/login", request.url));
    }
  }

  // ADMIN ROUTES (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminPayload = await verifyToken(adminToken, process.env.ADMIN_JWT_SECRET);
    if (!adminPayload) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // USER DASHBOARD (NextAuth)
  if (pathname.startsWith("/user/dashboard")) {
    if (!nextAuthToken) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

// This will cover all /institute/*, /admin/*, and /user/dashboard/*
export const config = {
  matcher: [
    "/institute/:path*",
    "/admin/:path*",
    "/user/dashboard/:path*",
  ],
};

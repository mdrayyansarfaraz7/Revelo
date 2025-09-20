
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



  // Institute routes (except login/register)
if (["/institute/login", "/institute/register"].includes(pathname)) {
  if (instituteToken) {
    const payload = await verifyToken(instituteToken, process.env.JWT_SECRET);
    if (payload) {
      // Optional: check for a `next` query parameter
      const nextUrl = request.nextUrl.searchParams.get("next");
      const redirectTo = nextUrl || `/institute/dashboard/${payload.id}`;
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }
}

  // Admin routes (except login)
if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
  const payload = await verifyToken(adminToken, process.env.ADMIN_JWT_SECRET);
  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

if (pathname === "/admin/login") {
  if (adminToken) {
    const payload = await verifyToken(adminToken, process.env.ADMIN_JWT_SECRET);
    if (payload) {
      return NextResponse.redirect(new URL("/admin/panel", request.url));
    }
  }
}

  // User dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!nextAuthToken) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }


  // User login/signup
  if (["/auth/signin", "/auth/signup"].includes(pathname)) {
    if (nextAuthToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Institute login/register
  if (["/institute/login", "/institute/register"].includes(pathname)) {
    if (instituteToken) {
      const payload = await verifyToken(instituteToken, process.env.JWT_SECRET);
      if (payload) {
        return NextResponse.redirect(new URL("/institute", request.url));
      }
    }
  }

  // Admin login
  if (pathname === "/admin/login") {
    if (adminToken) {
      const payload = await verifyToken(adminToken, process.env.ADMIN_JWT_SECRET);
      if (payload) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/institute/:path*", "/admin/:path*", "/dashboard/:path*", "/auth/:path*"],
};

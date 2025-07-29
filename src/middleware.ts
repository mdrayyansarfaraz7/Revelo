import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const verifyToken = async (token: string, secret: string) => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
  } catch {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const instituteToken = request.cookies.get('institute_token')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;
  const nextAuthToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  if ((pathname.startsWith('/institute/dashboard') || pathname === '/institute/create-event') 
      && !pathname.startsWith('/institute/login')) {
  if (!instituteToken || !(await verifyToken(instituteToken, process.env.JWT_SECRET!))) {
    return NextResponse.redirect(new URL('/institute/login', request.url));
  }
}

if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
  if (!adminToken || !(await verifyToken(adminToken, process.env.ADMIN_JWT_SECRET!))) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

  if (pathname.startsWith('/user/dashboard')) {
    if (!nextAuthToken) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: [
    '/institute/dashboard/:path*',
    '/event/create-event',
    '/admin/:path*',
    '/user/dashboard/:path*',
  ],
};

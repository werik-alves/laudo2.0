import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { cookie: req.headers.get("cookie") ?? "" },
        credentials: "include",
      });
      if (!res.ok) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
      const data = await res.json();
      if (!data?.user?.isAdmin) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    } catch {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/infoFormulario", "/admin/:path*"],
};

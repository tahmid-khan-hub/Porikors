import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const isPublic = PUBLIC_PATHS.includes(pathname);
    const isOnboarding = pathname.startsWith("/onboarding");

    // if user is not logged in
    if(!token) {
        if(isPublic) return NextResponse.next();
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // user is logged in but has no role -> onboarding
    if(!token.role && !isOnboarding) {
        return NextResponse.redirect(new URL("/onboarding", req.url))
    }  

    // user is logged in and has specific role then redirect to dashboard layout
    if(token.role && isOnboarding) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

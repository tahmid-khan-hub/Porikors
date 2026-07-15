import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const isPublic = PUBLIC_PATHS.includes(pathname);
    const isOnboarding = pathname.startsWith("/onboarding");
    const isPending = pathname.startsWith("/pending");

    // if user is not logged in
    if(!token) {
        if(isPublic) return NextResponse.next();
        return NextResponse.redirect(new URL("/login", req.url))
    }

    const roleStatus = token.roleStatus ?? "unset";

    // user is logged in but has no role -> onboarding
    if (roleStatus === "unset") {
        if (isPublic || isOnboarding) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // user logged in and select the role now waiting for approval
    if (roleStatus === "pending" || roleStatus === "rejected") {
        if (isPublic || isPending) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/pending", req.url));
    }

    // user is logged in and has specific role, also get the approval then redirect to dashboard layout
    if (roleStatus === "approved") {
        if (isPublic || isPending) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

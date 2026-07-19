import type { Session } from "next-auth";

export default function getPostAuthRedirect(user?: Session["user"] | null): string {
    if (!user) return "/login";

    const { roleStatus, role, isAdmin } = user;

    if (roleStatus === "approved") {
        if (role === "teacher") return "/teacher";
        if (role === "student") return "/student";
        return "/onboarding";
    }

    if (roleStatus === "unset") {
        return isAdmin ? "/admin/verifications" : "/onboarding";
    }

    return "/pending";
}

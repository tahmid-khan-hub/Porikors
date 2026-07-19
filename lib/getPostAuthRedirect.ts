interface SessionUser {
    roleStatus?: "unset" | "pending" | "approved" | "rejected";
    role?: "teacher" | "student" | null;
    isAdmin?: boolean;
}

export default function getPostAuthRedirect(user?: SessionUser | null): string {
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

    return "/pending"
}

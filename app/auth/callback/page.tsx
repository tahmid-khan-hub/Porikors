"use client";
import getPostAuthRedirect from "@/lib/getPostAuthRedirect";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if(status === 'loading') return;

        // status is "authenticated" or "unauthenticated" here
        const destination = getPostAuthRedirect(session?.user ?? null)
        router.replace(destination);
    }, [status, session, router]);

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#F6F5F1]">
            {/* plain spinner */}
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1F6F5C] border-t-transparent" />
        </div>
    );
}
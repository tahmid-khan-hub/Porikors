"use client"
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import LoginFormFields from "./LoginFormFields";

export default function LoginPageClientSide() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    return (
        <div className="w-full min-h-screen flex items-center justify-center px-2 overflow-x-hidden bg-[#F6F5F1]">
            <div className="bg-white border border-[#DAD7CE] w-full max-w-xl p-8 space-y-6 rounded-md mt-6">
                <h2 className="jakartaSans text-3xl font-bold text-center pt-4 text-[#1C2420]"> Welcome Back </h2>
                <p className="text-center text-sm text-[#1C2420]/60 -mt-2 mb-12"> Sign in to continue with Porikors </p>

                {/* Google Login */}
                <Button
                    onClick={() => signIn("google", { callbackUrl })}
                    type="button"
                    className="bg-[#1F6F5C] text-white hover:bg-[#175446] py-6 rounded-lg font-semibold text-[16px] w-full flex items-center justify-center gap-2"
                >
                    <FcGoogle />
                    Sign in with Google
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#DAD7CE]" />
                    <span className="text-[#1C2420]/50 ">or</span>
                    <div className="flex-1 h-px bg-[#DAD7CE]" />
                </div>

                {/* form fields */}
                <LoginFormFields callbackUrl={callbackUrl} />

                <p className="mb-4 mt-8 text-[#1C2420] text-center">
                    New to this site? {" "}
                    <Link className="text-[#1F6F5C] hover:underline" href={"/sign-up"}>
                    Sign-up
                    </Link>
                </p>
            </div>
        </div>
    )
}

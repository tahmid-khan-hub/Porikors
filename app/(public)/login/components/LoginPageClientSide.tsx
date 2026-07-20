"use client"
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LoginFormFields from "./LoginFormFields";
import { motion } from "framer-motion";
import GoogleButton from "@/components/auth/GoogleButton";

export default function LoginPageClientSide() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    return (
        <div className="w-full min-h-screen flex items-center justify-center px-2 overflow-x-hidden bg-[#F6F5F1]">
            <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }} 
            className="bg-white border border-[#DAD7CE] w-full max-w-xl p-8 space-y-6 rounded-md mt-6">
                <h2 className="text-3xl font-bold text-center pt-4 text-[#1C2420]"> Welcome Back </h2>
                <p className="text-center text-sm text-[#1C2420]/60 -mt-2 mb-12"> Sign in to continue with Porikors </p>

                {/* Google Login */}
                <GoogleButton />

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
                    <Link className="text-[#1F6F5C] hover:underline mr-1" href={"/register"}>
                    Register
                    </Link>
                    here
                </p>
            </motion.div>
        </div>
    )
}

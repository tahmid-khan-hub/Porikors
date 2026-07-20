"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc"; 

export default function GoogleButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => signIn("google", { callbackUrl: "/auth/callback" })}
      className="w-full py-6 border-[#DAD7CE] hover:bg-[#F6F5F1]"
    >
      <FcGoogle className="mr-2" size={18} />
      Continue with Google
    </Button>
  );
}

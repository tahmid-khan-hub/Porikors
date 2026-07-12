"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-[#DAD7CE]/20 bg-[#1F6F5C]/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="lobster text-lg font-bold text-[#1F6F5C]">
          Porikors
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <Button
              onClick={() => signOut()}
              className="bg-[#1F6F5C] text-white hover:bg-[#175446] px-3"
            >
              Log out
            </Button>
          ) : (
            <Link href="/login">
              <Button className="bg-[#1F6F5C] text-white hover:bg-[#175446] px-3">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

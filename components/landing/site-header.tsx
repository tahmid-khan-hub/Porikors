import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-[#DAD7CE]/20 bg-[#1F6F5C]/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-[#1F6F5C]">
          Porikors
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button className="bg-[#1F6F5C] text-white hover:bg-[#175446] px-3">
                Sign in
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

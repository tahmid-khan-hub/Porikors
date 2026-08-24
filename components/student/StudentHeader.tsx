"use client";
import { Bell, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface StudentHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  title?: string;
  onMenuClick: () => void;
}

export default function StudentHeader({ user, title = "Dashboard", onMenuClick }: StudentHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b border-[#DAD7CE] bg-[#F6F5F1] px-4 py-4 md:px-8">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-[#DAD7CE]/40 md:hidden"
                >
                    <Menu size={20} className="text-[#1C2420]" />
                </button>

                <div className="flex items-center gap-2 md:hidden">
                    <div className="w-8">
                        <Image
                            src="/porikors_logo.jpeg"
                            alt="Porikors logo"
                            width={36}
                            height={36}
                            className="rounded-lg "
                        />
                    </div>
                    <h3 className="lobster text-xl font-bold text-[#1F6F5C]">Porikors</h3>
                </div>

                <h1 className="hidden text-base font-medium text-[#1C2420] md:block">{title}</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#DAD7CE]/40"
                >
                    <Bell size={18} className="text-[#1C2420]" />
                </button>

                <Link href="/student/profile" className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full bg-[#DAD7CE]">
                        {user.image ? (
                            <Image src={user.image} alt={user.name ?? "Student"} fill className="object-cover" />
                        ) : (
                            <span className="h-full w-full flex items-center justify-center text-[#6B7369] text-xs font-medium">
                                {user.name?.charAt(0).toUpperCase() }
                            </span>
                        )}
                    </div>
                </Link>
            </div>
        </div>
    )
}
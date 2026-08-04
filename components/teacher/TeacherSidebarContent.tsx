"use client"
import { usePathname } from "next/navigation";
import { GraduationCap as UserCircle, LogOut, LayoutDashboard, BookOpen, FolderOpen, ClipboardList, Megaphone, Table } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";

const nav_items = [
    { label: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
    { label: "Courses", href: "/teacher/courses", icon: BookOpen },
    { label: "Resources", href: "/teacher/resources", icon: FolderOpen },
    { label: "Tasks", href: "/teacher/tasks", icon: ClipboardList },
    { label: "Announcements", href: "/teacher/announcements", icon: Megaphone },
    // { label: "Grades", href: "/teacher/grades", icon: Table },
]

export default function TeacherSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();
    return (
        <>
            <div className="flex items-center gap-2 px-6 py-6">
                <div className="flex leading-tight">
                    <div className="w-12 h-12 mt-1">
                        <Image src={"/porikors_logo.jpeg"} height={34} width={34} alt="porikors logo" className="rounded-lg" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="lobster text-xl font-bold text-[#1F6F5C]">Porikors</h3>
                        <p className="text-[10px] tracking-wide text-[#8A9186] uppercase">
                            Teacher Console
                        </p>
                    </div>
                </div>
            </div>

            {/* nav items */}
            <nav className="flex-1 px-3 py-2 space-y-1">
                {nav_items.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                            isActive
                            ? "bg-[#1F6F5C]/15 text-[#3B8F5C] font-medium"
                            : "text-[#B7BDB3] hover:bg-white/5 hover:text-[#F6F5F1]"
                            }`}>
                                <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
                <button
                    type="button"
                    onClick={() => {
                        onNavigate?.();
                        signOut({ callbackUrl: "/login" });
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors text-[#B7BDB3] hover:bg-white/5 hover:text-[#F6F5F1]"
                    >
                        <LogOut size={18} />
                        Log out
                </button>
            </nav>

            <div className="border-t border-white/10 px-3 py-4">
                <Link
                    href="/teacher/profile"
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#B7BDB3] hover:bg-white/5 hover:text-[#F6F5F1] transition-colors">
                        <UserCircle size={18} />
                        Teacher Profile
                </Link>
            </div>
        </>
    )
}
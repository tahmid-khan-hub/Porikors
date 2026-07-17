"use client"
import { usePathname } from "next/navigation";
import { ClipboardCheck, GraduationCap as TeacherIcon, Users, Settings, UserCircle } from "lucide-react";
import Link from "next/link";

const nav_items = [
    { label: "Pending Verifications", href: "/admin/verifications", icon: ClipboardCheck },
    { label: "Teachers", href: "/admin/teachers", icon: TeacherIcon  },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebarContent() {
    const pathname = usePathname();
    return (
        <>
            <div className="flex items-center gap-2 px-6 py-6">
                <div className="leading-tight">
                    <h3 className="lobster text-xl font-bold text-[#1F6F5C]">Porikors</h3>
                    <p className="text-[10px] tracking-wide text-[#8A9186] uppercase">
                        Admin Console
                    </p>
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
            </nav>

            <div className="border-t border-white/10 px-3 py-4">
                <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#B7BDB3] hover:bg-white/5 hover:text-[#F6F5F1] transition-colors">
                    <UserCircle size={18} />
                    Admin Profile
                </Link>
            </div>
        </>
    )
}
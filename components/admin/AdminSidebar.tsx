"use client";
import AdminSidebarContent from "./AdminSidebarContent";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    return (
        <aside className="w-64 shrink-0 flex flex-col bg-[#12170F] text-[#F6F5F1] min-h-screen">
            <AdminSidebarContent />
        </aside>
    )
}

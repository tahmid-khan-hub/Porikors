"use client";
import { useState } from "react";
import StudentHeader from "./StudentHeader";
import StudentSidebar from "./StudentSidebar";

interface StudentChromeProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  title?: string;
  children: React.ReactNode;
}

export default function StudentChrome({ user, title, children, }: StudentChromeProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6F5F1]">
        <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
            <StudentHeader user={user} title={title} onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
    </div>
  );
}

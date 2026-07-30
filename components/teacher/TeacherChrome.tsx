"use client";
import { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import TeacherHeader from "./TeacherHeader";

interface TeacherChromeProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  title?: string;
  children: React.ReactNode;
}

export default function TeacherChrome({ user, title, children, }: TeacherChromeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#F6F5F1]">
      <TeacherSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TeacherHeader user={user} title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

"use client"
import { StudentRecentAnnouncement } from "@/types/studentDashboard";
import { Megaphone } from "lucide-react";

export default function RecentAnnouncementsList({ announcements }: { announcements: StudentRecentAnnouncement[] }) {
    if (announcements.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <Megaphone size={22} className="text-[#6B7369]" />
                <p className="text-sm text-[#6B7369]">No announcements yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {announcements.map((a) => (
                <div key={a.id} className="rounded-md px-3 py-2.5 hover:bg-[#F6F5F1] transition-colors">
                    <p className="text-xs text-[#1F6F5C] font-medium mb-0.5">{a.course_name}</p>
                    <p className="text-sm text-[#1C2420] line-clamp-2">{a.content}</p>
                    <p className="text-xs text-[#6B7369] mt-1">{new Date(a.created_at).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}

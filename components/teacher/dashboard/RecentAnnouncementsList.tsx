"use client"
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { RecentAnnouncement } from "@/types/teacherDashboard";

function timeAgo(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export default function RecentAnnouncementsList({ announcements }: { announcements: RecentAnnouncement[] }) {
    if (announcements.length === 0) {
        return <p className="py-6 text-center text-sm text-[#6B7369]">No announcements posted yet.</p>;
    }

    return (
        <ul className="flex flex-col divide-y divide-[#DAD7CE]">
            {announcements.map((a) => (
                <li key={a.id}>
                    <Link
                        href={`/teacher/courses/${a.course_id}/announcements`}
                        className="flex items-start gap-3 py-3 hover:bg-[#F6F5F1] -mx-2 px-2 rounded-md transition-colors"
                    >
                        <Megaphone size={16} className="mt-0.5 shrink-0 text-[#1F6F5C]" />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="truncate text-sm font-medium text-[#1C2420]">{a.title}</span>
                                <span className="shrink-0 text-xs text-[#6B7369]">{timeAgo(a.created_at)}</span>
                            </div>
                            <p className="line-clamp-1 text-xs text-[#6B7369]">{a.content}</p>
                            <span className="text-xs text-[#6B7369]">{a.course_name}</span>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
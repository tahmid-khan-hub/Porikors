import { StudentAnnouncement } from "@/types/announcement";
import { Megaphone } from "lucide-react";

function timeAgo(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function AnnouncementCard({ announcement }: { announcement: StudentAnnouncement }) {
    return (
        <div className="flex gap-3 rounded-lg border border-[#DAD7CE] bg-white p-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F6F5F1]">
                <Megaphone size={15} className="text-[#1F6F5C]" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-[#6B7369]">
                    <span className="font-medium text-[#1C2420]">{announcement.teacherName}</span>
                    <span>·</span>
                    <span>{announcement.courseName ?? "All courses"}</span>
                    <span>·</span>
                    <span>{timeAgo(announcement.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-[#1C2420]">{announcement.content}</p>
            </div>
        </div>
    );
}
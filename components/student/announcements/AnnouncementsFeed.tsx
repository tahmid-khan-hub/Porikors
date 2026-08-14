"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentAnnouncements } from "@/lib/api/fetchStudentAnnouncements";
import AnnouncementCard from "./AnnouncementCard";
import { Megaphone } from "lucide-react";

export default function AnnouncementsFeed({ limit = 10 }: { limit?: number }) {
    const { data, isLoading } = useQuery({
        queryKey: ["announcements", "student", limit],
        queryFn: () => fetchStudentAnnouncements(limit),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 w-full rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />
                ))}
            </div>
        );
    }

    const announcements = data ?? [];

    if (announcements.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#DAD7CE] bg-white py-12 px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6F5F1]">
                    <Megaphone size={20} className="text-[#6B7369]" />
                </div>
                <p className="text-sm text-[#6B7369]">No announcements yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
        </div>
    );
}
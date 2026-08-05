"use client";
import { fetchStudentCourseAnnouncements } from "@/lib/api/fetchStudentCourse";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, TriangleAlert } from "lucide-react";

export default function StudentCourseAnnouncements({ courseId }: { courseId: string }) {
    const { data: announcements, isLoading, isError } = useQuery({
        queryKey: ["student", "course", courseId, "announcements"],
        queryFn: () => fetchStudentCourseAnnouncements(courseId),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-20 w-full rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#DAD7CE] bg-white py-14 px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC]">
                    <TriangleAlert size={22} className="text-[#6B7369]" />
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-medium text-[#6B7369]">Failed to load announcements</p>
                </div>
            </div>
        )
    }

    if (!announcements || announcements.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-14 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                    <Megaphone size={22} className="text-[#6B7369]" />
                </div>
                <p className="text-sm text-[#6B7369]">No announcements yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {announcements.map((a) => (
                <div key={a.id} className="rounded-lg border border-[#DAD7CE] bg-white p-4">
                    <p className="text-sm text-[#1C2420] whitespace-pre-wrap">{a.content}</p>
                    <p className="mt-2 text-xs text-[#6B7369]">{new Date(a.created_at).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}

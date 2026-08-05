"use client";
import { fetchStudentCourseResources } from "@/lib/api/fetchStudentCourse";
import { useQuery } from "@tanstack/react-query";
import { FolderOpen, FileText, Video, Link as LinkIcon, File, CloudOff } from "lucide-react";

const typeIcons = {
    video: Video,
    note: FileText,
    slide: FileText,
    link: LinkIcon,
    file: File,
};

export default function StudentCourseResources({ courseId }: { courseId: string }) {
    const { data: resources, isLoading, isError } = useQuery({
        queryKey: ["student", "course", courseId, "resources"],
        queryFn: () => fetchStudentCourseResources(courseId),
    });

    if (isLoading) {
        return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 w-full rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />
            ))}
        </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#DAD7CE] bg-white py-14 px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC]">
                    <CloudOff size={22} className="text-[#C1443D]" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-[#C1443D]">Failed to load resources</p>
                </div>
            </div>
        )
    }

    if (!resources || resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-14 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                    <FolderOpen size={22} className="text-[#6B7369]" />
                </div>
                <p className="text-sm text-[#6B7369]">No resources yet for this course.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {resources.map((r) => {
                const Icon = typeIcons[r.type] ?? File;
                return (
                    <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-[#DAD7CE] bg-white p-4 flex items-center gap-3 hover:border-[#1F6F5C]/30 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-md bg-[#1F6F5C]/10 flex items-center justify-center shrink-0">
                            <Icon size={16} className="text-[#1F6F5C]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#1C2420] truncate">{r.title}</p>
                            <p className="text-xs text-[#6B7369]">{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}
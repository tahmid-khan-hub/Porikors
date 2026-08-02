"use client"
import { CourseDetail } from "@/types/course"
import { Copy, Users } from "lucide-react"
import { toast } from "sonner";

export default function CourseDetailHeader({ course }: { course: CourseDetail }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(course.joinCode);
        toast.success("Join code copied");
    };

    return (
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-[#1C2420]">{course.title}</h1>
                    {course.isArchived && (
                        <span className="text-xs bg-[#F6F5F1] text-[#6B7369] rounded-full px-2 py-0.5">Archived</span>
                    )}
                </div>

                {course.description && (
                    <p className="text-[#6B7369] mt-1">{course.description}</p>
                )}

                <div className="flex items-center gap-1.5 text-[#6B7369] text-sm mt-2">
                    <Users size={15} />{course.studentCount} students
                </div>
            </div>

            <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-[#F6F5F1] rounded-lg px-3 py-2 hover:bg-[#DAD7CE]/40 transition-colors"
            >
                <span className="font-mono text-sm tracking-wide text-[#1C2420]">{course.joinCode}</span>
                <Copy size={15} className="text-[#1F6F5C]" />
            </button>
        </div>
    )
}
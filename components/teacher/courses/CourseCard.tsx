"use client";
import { Course } from "@/types/course";
import { Copy, MoreVertical, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CourseCard({ course }: { course: Course }) {
    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(course.joinCode); // the browser's API for copying to and reading from the system clipboard
        toast.success("Join code copied");
    }
    return (
        <>
            <Link
            href={`/teacher/courses/${course.id}`}
            className={`bg-white border border-[#DAD7CE] rounded-xl p-4 flex flex-col gap-3 hover:border-[#1F6F5C]/40 transition-colors ${
                course.isArchived ? "opacity-60" : ""
            }`}>
                <div className="flex justify-between items-start">
                    <p className="font-medium text-[15px] text-[#1C2420]">{course.title}</p>
                    <button
                        onClick={(e) => e.preventDefault()}
                        aria-label="Course options"
                        className="text-[#6B7369]"
                    >
                        <MoreVertical size={18} />
                    </button>
                </div>
                <div className="flex items-center gap-1.5 text-[#6B7369] text-sm">
                    <Users size={15} />
                    {course.studentCount} students
                </div>
                <div className="flex items-center justify-between bg-[#F6F5F1] rounded-lg px-2.5 py-1.5">
                    <span className="font-mono text-sm tracking-wide text-[#1C2420]">
                        {course.joinCode}
                    </span>
                    {!course.isArchived && (
                        <button onClick={handleCopy} aria-label="Copy join code">
                            <Copy size={15} className="text-[#1F6F5C]" />
                        </button>
                    )}
                </div>
            </Link>
        </>
    )
}

"use client"
import Link from "next/link";
import { StudentDashboardCourse } from "@/types/studentDashboard";
import { BookOpen } from "lucide-react";

export default function CoursesOverviewGrid({ courses }: { courses: StudentDashboardCourse[] }) {
    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                    <BookOpen size={20} className="text-[#6B7369]" />
                </div>
                <p className="text-sm text-[#6B7369]">You haven&apos;t joined any courses yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
                <Link
                    key={c.id}
                    href={`/student/courses/${c.id}`}
                    className="rounded-lg border border-[#DAD7CE] p-4 hover:border-[#1F6F5C]/30 hover:shadow-sm transition-all"
                >
                    <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm text-[#1C2420] line-clamp-1">{c.title}</p>
                        {c.pending_task_count > 0 && (
                            <span className="shrink-0 rounded-full bg-[#D98B3F]/10 text-[#D98B3F] text-xs font-medium px-2 py-0.5">
                                {c.pending_task_count} due
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-[#6B7369] mt-1">{c.teacher_name}</p>
                    <p className="text-xs text-[#6B7369] mt-2">{c.student_count} students</p>
                </Link>
            ))}
        </div>
    );
}

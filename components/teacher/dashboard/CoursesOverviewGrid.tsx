"use client"
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { CourseSummary } from "@/types/teacherDashboard";

export default function CoursesOverviewGrid({ courses }: { courses: CourseSummary[] }) {
    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#DAD7CE] bg-white py-12 text-center">
                <p className="text-sm text-[#6B7369]">You haven&apos;t created any courses yet.</p>
                <Link href="/teacher/courses" className="text-sm font-medium text-[#1F6F5C] hover:text-[#175446]">
                Create your first course →
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
                <Link
                    key={c.id}
                    href={`/teacher/courses/${c.id}`}
                    className="group flex flex-col gap-2 rounded-xl border border-[#DAD7CE] bg-white p-4 transition-colors hover:border-[#1F6F5C]"
                >
                    <div className="flex items-start justify-between">
                        <h3 className="text-sm font-medium text-[#1C2420]">{c.name}</h3>
                        <ArrowRight size={14} className="text-[#6B7369] opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7369]">
                        <Users size={12} />
                        {c.student_count} student{c.student_count !== 1 ? "s" : ""}
                    </div>
                    <span className="w-fit rounded bg-[#F6F5F1] px-2 py-0.5 font-mono text-xs text-[#6B7369]">
                        {c.join_code}
                    </span>
                </Link>
            ))}
        </div>
    );
}
"use client"
import Link from "next/link";
import { StudentRecentGrade } from "@/types/studentDashboard";
import { Award } from "lucide-react";

export default function RecentGradesList({ grades }: { grades: StudentRecentGrade[] }) {
    if (grades.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <Award size={22} className="text-[#6B7369]" />
                <p className="text-sm text-[#6B7369]">No grades yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {grades.map((g) => (
                <Link
                    key={g.task_id}
                    href={`/student/courses/${g.course_id}/tasks/${g.task_id}`}
                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 hover:bg-[#F6F5F1] transition-colors"
                >
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1C2420] truncate">{g.task_title}</p>
                        <p className="text-xs text-[#6B7369] truncate">{g.course_name}</p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-[#3B8F5C]">
                        {g.grade}{g.max_marks !== null ? `/${g.max_marks}` : ""}
                    </span>
                </Link>
            ))}
        </div>
    );
}

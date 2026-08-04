"use client"
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { UpcomingDeadline } from "@/types/teacherDashboard";

function formatDeadline(iso: string) {
    const d = new Date(iso);
    const diffHours = (d.getTime() - Date.now()) / (1000 * 60 * 60);
    const urgent = diffHours < 48;
    return {
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
        urgent,
    };
}

export default function UpcomingDeadlinesList({ deadlines }: { deadlines: UpcomingDeadline[] }) {
    if (deadlines.length === 0) {
        return <p className="py-6 text-center text-sm text-[#6B7369]">No upcoming deadlines.</p>;
    }

    return (
        <ul className="flex flex-col divide-y divide-[#DAD7CE]">
            {deadlines.map((d) => {
                const { label, urgent } = formatDeadline(d.deadline);
                return (
                    <li key={d.task_id}>
                        <Link
                            href={`/teacher/courses/${d.course_id}/tasks/${d.task_id}`}
                            className="flex items-center justify-between gap-3 py-3 hover:bg-[#F6F5F1] -mx-2 px-2 rounded-md transition-colors"
                        >
                            <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-[#1C2420]">{d.task_title}</div>
                                <div className="truncate text-xs text-[#6B7369]">{d.course_name}</div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2 text-right">
                                <span className="text-xs text-[#6B7369]">
                                {d.submitted_count}/{d.enrolled_count} submitted
                                </span>
                                <span
                                    className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                                    style={{
                                        color: urgent ? "#C1443D" : "#6B7369",
                                        backgroundColor: urgent ? "#FBEAE9" : "#F6F5F1",
                                    }}
                                >
                                    <CalendarClock size={12} />
                                    {label}
                                </span>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
"use client";
import { useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { StudentUpcomingDeadline } from "@/types/studentDashboard";

export default function UpcomingDeadlinesList({ deadlines, }: { deadlines: StudentUpcomingDeadline[]; }) {
    const [now] = useState(() => Date.now());

    if (deadlines.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <CalendarClock size={22} className="text-[#6B7369]" />
                <p className="text-sm text-[#6B7369]">
                No upcoming deadlines. You&apos;re all caught up.
                </p>
            </div>
        );
    }

    const deadlineItems = deadlines.map((d) => {
        const daysLeft = Math.ceil( (new Date(d.deadline).getTime() - now) / (1000 * 60 * 60 * 24));
        return { ...d, daysLeft, urgent: daysLeft <= 2, };
    });

    return (
        <div className="flex flex-col gap-2">
            {deadlineItems.map((d) => (
                <Link
                    key={d.task_id}
                    href={`/student/courses/${d.course_id}/tasks/${d.task_id}`}
                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-[#F6F5F1]"
                >
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#1C2420]">
                            {d.task_title}
                        </p>
                        <p className="truncate text-xs text-[#6B7369]">
                            {d.course_name}
                        </p>
                    </div>

                    <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                            backgroundColor: d.urgent ? "#C1443D1A" : "#DAD7CE",
                            color: d.urgent ? "#C1443D" : "#6B7369",
                        }}
                    >
                        {d.daysLeft <= 0 ? "Due today" : `${d.daysLeft}d left`}
                    </span>
                </Link>
            ))}
        </div>
    );
}
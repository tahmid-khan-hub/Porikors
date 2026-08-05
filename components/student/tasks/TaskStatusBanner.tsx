"use client";
import { StudentTaskDetail } from "@/types/studentTaskDetail";
import { submissionStatusStyles } from "@/lib/taskStatus";
import { Clock, CheckCircle2 } from "lucide-react";

export default function TaskStatusBanner({ task }: { task: StudentTaskDetail }) {
    const status = task.submission?.status ?? "not_submitted";
    const style = submissionStatusStyles[status];
    const deadline = new Date(task.deadline);
    const isPast = new Date() > deadline;

    return (
        <div
            className="rounded-lg border p-4 flex items-center justify-between gap-3"
            style={{ backgroundColor: style.bg, borderColor: style.text + "33" }}
        >
            <div className="flex items-center gap-2">
                {status === "graded" ? (
                    <CheckCircle2 size={18} style={{ color: style.text }} />
                ) : (
                    <Clock size={18} style={{ color: style.text }} />
                )}
                <div>
                    <p className="text-sm font-medium" style={{ color: style.text }}>
                        {style.label}
                        {status === "graded" && task.submission?.marks !== null && task.max_marks !== null
                        ? ` — ${task.submission?.marks}/${task.max_marks}`
                        : ""}
                    </p>
                    <p className="text-xs" style={{ color: style.text, opacity: 0.8 }}>
                        {isPast ? "Deadline passed: " : "Due "}
                        {deadline.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

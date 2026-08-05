"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, TriangleAlert } from "lucide-react";
import { fetchStudentCourseTasks } from "@/lib/api/fetchStudentCourse";
import { submissionStatusStyles } from "@/lib/taskStatus";

export default function StudentCourseTasks({ courseId }: { courseId: string }) {
    const { data: tasks, isLoading, isError } = useQuery({
        queryKey: ["student", "course", courseId, "tasks"],
        queryFn: () => fetchStudentCourseTasks(courseId),
    });

    if (isLoading) {
        return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 w-full rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />
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

                <p className="text-sm text-[#6B7369]"> Failed to load tasks.</p>
            </div>
        )
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-14 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                    <ClipboardList size={22} className="text-[#6B7369]" />
                </div>
                <p className="text-sm text-[#6B7369]">No tasks yet for this course.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {tasks.map((task) => {
                const style = submissionStatusStyles[task.submission_status];
                return (
                    <Link
                        key={task.id}
                        href={`/student/courses/${courseId}/tasks/${task.id}`}
                        className="rounded-lg border border-[#DAD7CE] bg-white p-4 flex items-start justify-between gap-3 hover:border-[#1F6F5C]/30 transition-colors"
                    >
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-sm text-[#1C2420]">{task.title}</p>
                                <span
                                className="rounded-full px-2 py-0.5 text-xs font-medium"
                                style={{ backgroundColor: style.bg, color: style.text }}
                                >
                                {style.label}
                                {task.submission_status === "graded" && task.submission_marks !== null && task.max_marks !== null
                                    ? ` · ${task.submission_marks}/${task.max_marks}`
                                    : ""}
                                </span>
                            </div>
                            {task.description && (
                                <p className="mt-1 text-sm text-[#6B7369] line-clamp-2">{task.description}</p>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#6B7369]">
                                <span>Due {new Date(task.deadline).toLocaleString()}</span>
                                {task.max_marks !== null && (
                                <span className="rounded-full bg-[#F6F5F1] px-2 py-0.5">{task.max_marks} marks</span>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
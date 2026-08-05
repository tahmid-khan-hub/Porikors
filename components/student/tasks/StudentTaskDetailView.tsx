"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentTaskDetail } from "@/lib/api/fetchStudentTaskDetail";
import TaskStatusBanner from "./TaskStatusBanner";
import TaskSubmissionForm from "./TaskSubmissionForm";
import { TriangleAlert } from "lucide-react";

export default function StudentTaskDetailView({ courseId, taskId }: { courseId: string; taskId: string }) {
    const { data: task, isLoading, isError } = useQuery({
        queryKey: ["student", "task", taskId],
        queryFn: () => fetchStudentTaskDetail(courseId, taskId),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="h-16 w-full rounded-lg bg-[#DAD7CE] animate-pulse" />
                <div className="h-48 w-full rounded-lg bg-[#DAD7CE] animate-pulse" />
            </div>
        );
    }

    if (isError || !task) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#DAD7CE] bg-white px-6 py-14 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC]">
                    <TriangleAlert size={22} className="text-[#6B7369]" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-[#1C2420]">Unable to load task</h3>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 max-w-7xl">
            <div>
                <p className="text-xs text-[#6B7369] mb-1">{task.course_title}</p>
                <h1 className="text-xl font-semibold text-[#1C2420]">{task.title}</h1>
                {task.description && (
                    <p className="mt-2 text-sm text-[#6B7369] whitespace-pre-wrap">{task.description}</p>
                )}
            </div>

            <TaskStatusBanner task={task} />
            <TaskSubmissionForm task={task} />
        </div>
    );
}

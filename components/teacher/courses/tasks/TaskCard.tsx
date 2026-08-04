"use client";
import Link from "next/link";
import { Task } from "@/types/task";
import { getTaskDeadlineStatus, taskStatusStyles } from "@/lib/taskStatus";
import TaskCardMenu from "./TaskCardMenu";

export default function TaskCard({ task, queryKey, }: { task: Task; queryKey: unknown[]; }) {
  const status = getTaskDeadlineStatus(task.deadline);
  const style = taskStatusStyles[status];

  return (
    <div className="relative rounded-lg border border-[#DAD7CE] bg-white p-4">
      <Link
        href={`/teacher/courses/${task.course_id}/tasks/${task.id}`}
        className="absolute inset-0"
      />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm text-[#1C2420]">{task.title}</p>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {style.label}
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
            {task.allowed_file_types && task.allowed_file_types.length > 0 ? (
              task.allowed_file_types.map((ft) => (
                <span
                  key={ft}
                  className="rounded-full border border-[#DAD7CE] px-2 py-0.5"
                >
                  {ft}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-[#DAD7CE] px-2 py-0.5">
                Text only
              </span>
            )}
          </div>
        </div>
        
        <TaskCardMenu task={task} queryKey={queryKey} />
      </div>
    </div>
  );
}

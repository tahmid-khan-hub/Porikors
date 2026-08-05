"use client";
import Link from "next/link";
import { StudentCourse } from "@/types/studentCourse";
import { FolderOpen, ClipboardList, User } from "lucide-react";

export default function StudentCourseCard({ course }: { course: StudentCourse }) {
    return (
        <Link
            href={`/student/courses/${course.id}`}
            className="group rounded-xl border border-[#DAD7CE] bg-white p-4 flex flex-col gap-3 hover:shadow-sm hover:border-[#1F6F5C]/30 transition-all"
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm text-[#1C2420] line-clamp-1">{course.title}</h3>
                {course.pending_task_count > 0 && (
                    <span className="shrink-0 rounded-full bg-[#D98B3F]/10 text-[#D98B3F] text-xs font-medium px-2 py-0.5">
                        {course.pending_task_count} due
                    </span>
                )}
            </div>

            {course.description && (
                <p className="text-sm text-[#6B7369] line-clamp-2">{course.description}</p>
            )}

            <div className="flex items-center gap-1.5 text-xs text-[#6B7369]">
                <User size={12} />
                <span>{course.teacher_name}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#6B7369] pt-2 border-t border-[#DAD7CE]">
                <div className="flex items-center gap-1.5">
                    <ClipboardList size={13} />
                    <span>{course.task_count} tasks</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <FolderOpen size={13} />
                    <span>{course.resource_count} resources</span>
                </div>
            </div>
        </Link>
    );
}
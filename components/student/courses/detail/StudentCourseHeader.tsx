"use client";
import { fetchStudentCourseDetail } from "@/lib/api/fetchStudentCourse";
import { useQuery } from "@tanstack/react-query";
import { User, KeyRound, BookX } from "lucide-react";

export default function StudentCourseHeader({ courseId }: { courseId: string }) {
    const { data: course, isLoading } = useQuery({
        queryKey: ["student", "course", courseId],
        queryFn: () => fetchStudentCourseDetail(courseId),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                <div className="h-7 w-64 rounded bg-[#DAD7CE] animate-pulse" />
                <div className="h-4 w-40 rounded bg-[#DAD7CE] animate-pulse" />
            </div>
        );
    }

    if (!course) return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#DAD7CE] bg-white py-14 px-6 text-center">
            <BookX className="h-12 w-12 text-[#6B7369]" strokeWidth={1.75} />

            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#2E3A2F]">
                    Course not found
                </h3>
                <p className="text-sm text-[#6B7369]">
                    The course may have been removed or you don&apos;t have access to it.
                </p>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-[#1C2420]">{course.title}</h1>
                {course.description && (
                    <p className="text-sm text-[#6B7369] max-w-2xl">{course.description}</p>
                )}
            <div className="flex items-center gap-4 text-xs text-[#6B7369] mt-1">
                <span className="flex items-center gap-1.5">
                    <User size={13} /> {course.teacher_name}
                </span>
                <span className="flex items-center gap-1.5">
                    <KeyRound size={13} /> {course.join_code}
                </span>
            </div>
        </div>
    );
}
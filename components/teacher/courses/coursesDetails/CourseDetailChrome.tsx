"use client"
import { fetchCourseDetail } from "@/lib/api/fetchCourses";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import CourseDetailHeader from "./CourseDetailHeader";
import CourseTabs from "./CourseTabs";

export default function CourseDetailChrome({ courseId, children, }: {
    courseId: string; children: React.ReactNode;
}) {
    const { data: course, isLoading } = useQuery({
        queryKey: ["course", courseId],
        queryFn: () => fetchCourseDetail(courseId),
    })

    if (isLoading) {
        return (
            <div className="p-6 flex flex-col gap-6">
                <div className="h-16 bg-white border border-[#DAD7CE] rounded-xl animate-pulse" />
                <div className="h-10 bg-white border border-[#DAD7CE] rounded-xl animate-pulse" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-16 px-6 text-center max-w-md mx-auto mt-10">
                <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                    <BookOpen size={22} className="text-[#6B7369]" />
                </div>
                <div>
                    <p className="font-medium text-[15px] text-[#1C2420]">Course not found</p>
                    <p className="text-sm text-[#6B7369] mt-1">This course may have been deleted or you don&apos;t have access to it.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="p-6 flex flex-col gap-6">
            <CourseDetailHeader course={course} />
            <CourseTabs courseId={courseId} />
            <div>{children}</div>
        </div>
    )
}
"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentCourses } from "@/lib/api/fetchStudentCourses";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import StudentCourseCard from "./StudentCourseCard";
import JoinCourseDialog from "./JoinCourseDialog";

export default function StudentCoursesGrid() {
    const [joinOpen, setJoinOpen] = useState(false);

    const { data: courses, isLoading, isError, refetch } = useQuery({
        queryKey: ["student", "courses"], queryFn: fetchStudentCourses,
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1C2420]">My Courses</h2>
                <Button
                    onClick={() => setJoinOpen(true)}
                    className="rounded-md px-4 py-2 text-sm font-medium text-white bg-[#1F6F5C] hover:bg-[#175446]"
                >
                    <Plus size={15} className="mr-1.5" /> Join Course
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-36 w-full rounded-xl border border-[#DAD7CE] bg-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-14 px-6 text-center">
                    <p className="text-sm text-[#C1443D]">Failed to load courses.</p>
                    <Button variant="outline" onClick={() => refetch()}>Retry</Button>
                </div>
            ) : courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((c) => (
                        <StudentCourseCard key={c.id} course={c} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 bg-white border border-[#DAD7CE] rounded-xl py-14 px-6 mt-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#F6F5F1] flex items-center justify-center">
                        <BookOpen size={22} className="text-[#6B7369]" />
                    </div>
                    <p className="text-sm text-[#1C2420] font-medium">No courses yet</p>
                    <p className="text-sm text-[#6B7369] max-w-xs">
                        Join a course using the code your teacher shared with you.
                    </p>
                    <Button
                        onClick={() => setJoinOpen(true)}
                        className="mt-2 bg-[#1F6F5C] hover:bg-[#175446] text-white"
                    >
                        <Plus size={15} className="mr-1.5" /> Join Course
                    </Button>
                </div>
            )}

            <JoinCourseDialog open={joinOpen} onOpenChange={setJoinOpen} />
        </div>
    );
}
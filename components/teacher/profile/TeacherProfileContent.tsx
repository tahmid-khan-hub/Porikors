"use client";
import { useQuery } from "@tanstack/react-query";
import TeacherProfileHeader from "./TeacherProfileHeader";
import TeacherAcademicInfo from "./TeacherAcademicInfo";
import TeacherStatsRow from "./TeacherStatsRow";
import TeacherCourseList from "./TeacherCourseList";
import { fetchTeacherProfile } from "@/lib/api/fetchProfile";

export default function TeacherProfileContent() {
    const queryKey = ["profile", "teacher"];

    const { data, isLoading, isError } = useQuery({
        queryKey,
        queryFn: fetchTeacherProfile,
    });

    if (isLoading) {
        return (
            <div className="max-w-275 mx-auto space-y-4">
                <div className="h-28 rounded-xl border border-[#DAD7CE] bg-gray-100 animate-pulse" />
                <div className="h-40 rounded-xl border border-[#DAD7CE] bg-gray-100 animate-pulse" />
                <div className="h-24 rounded-xl border border-[#DAD7CE] bg-gray-100 animate-pulse" />
                <div className="h-56 rounded-xl border border-[#DAD7CE] bg-gray-100 animate-pulse" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="max-w-225 mx-auto rounded-xl border border-[#DAD7CE] bg-white p-6 text-center text-sm text-[#C1443D]">
                Couldn&apos;t load your profile. Try refreshing the page.
            </div>
        );
    }

    return (
        <div className="max-w-360 mx-auto space-y-4">
            <TeacherProfileHeader identity={data.identity} queryKey={queryKey} />
            <TeacherAcademicInfo academic={data.academic} />
            <TeacherStatsRow stats={data.stats} />
            <TeacherCourseList courses={data.courses} />
        </div>
    );
}
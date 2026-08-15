"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentProfile } from "@/lib/api/fetchProfile";
import StudentAcademicInfo from "./StudentAcademicInfo";
import StudentStatsRow from "./StudentStatsRow";
import StudentCourseList from "./StudentCourseList";
import ProfileHeader from "@/components/profile/ProfileHeader";

export default function StudentProfileContent() {
    const queryKey = ["profile", "student"];

    const { data, isLoading, isError } = useQuery({
        queryKey,
        queryFn: fetchStudentProfile,
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
            <ProfileHeader identity={data.identity} queryKey={queryKey} />
            <StudentAcademicInfo academic={data.academic} />
            <StudentStatsRow stats={data.stats} />
            <StudentCourseList courses={data.courses} />
        </div>
    );
}
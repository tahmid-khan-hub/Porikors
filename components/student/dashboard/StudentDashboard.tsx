"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentDashboard } from "@/lib/api/fetchStudentDashboard";
import StudentStatsGrid from "./StudentStatsGrid";
import DashboardCard from "./DashboardCard";
import UpcomingDeadlinesList from "./UpcomingDeadlinesList";
import RecentAnnouncementsList from "./RecentAnnouncementsList";
import RecentGradesList from "./RecentGradesList";
import CoursesOverviewGrid from "./CoursesOverviewGrid";
import DashboardSkeleton from "./DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

export default function StudentDashboard() {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["student", "dashboard"],
        queryFn: fetchStudentDashboard,
    });

    if (isLoading) return <DashboardSkeleton />;

    if (isError || !data) {
        return (
            <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-3 rounded-xl border border-[#DAD7CE] bg-white px-6 py-14 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEC]">
                    <TriangleAlert size={22} className="text-[#C1443D]" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-[#1C2420]">Unable to load dashboard</h3>
                    <p className="text-sm text-[#6B7369]">Something went wrong while loading your dashboard.</p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    className="mt-2"
                >Retry</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <StudentStatsGrid stats={data.stats} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <DashboardCard title="Upcoming deadlines">
                    <UpcomingDeadlinesList deadlines={data.upcomingDeadlines} />
                </DashboardCard>
                <DashboardCard title="Recent announcements">
                    <RecentAnnouncementsList announcements={data.recentAnnouncements} />
                </DashboardCard>
                <DashboardCard title="Recent grades">
                    <RecentGradesList grades={data.recentGrades} />
                </DashboardCard>
            </div>

            <DashboardCard
                title="Your courses"
                action={
                <Link href="/student/courses" className="text-xs font-medium text-[#1F6F5C] hover:text-[#175446]">
                    View all →
                </Link>
                }
            >
                <CoursesOverviewGrid courses={data.courses} />
            </DashboardCard>
        </div>
    );
}
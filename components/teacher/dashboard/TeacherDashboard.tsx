"use client";
import Link from "next/link";
import StatsGrid from "./StatsGrid";
import DashboardCard from "./DashboardCard";
import UpcomingDeadlinesList from "./UpcomingDeadlinesList";
import RecentAnnouncementsList from "./RecentAnnouncementsList";
import CoursesOverviewGrid from "./CoursesOverviewGrid";
import { fetchTeacherDashboard } from "@/lib/api/fetchTeacherDashboard";
import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "./DashboardSkeleton";

export default function TeacherDashboard() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["teacher", "dashboard"], queryFn: fetchTeacherDashboard,
    });

    const stats = data?.stats;
    const upcomingDeadlines = data?.upcomingDeadlines ?? [];
    const recentAnnouncements = data?.recentAnnouncements ?? [];
    const courses = data?.courses ?? []

    if (isLoading) return <DashboardSkeleton />;
    if (isError || !stats) {
        return <p className="py-12 text-center text-sm text-[#C1443D]">Failed to load your dashboard.</p>;
    }

    return (
        <div className="flex flex-col gap-6">
            <StatsGrid stats={stats} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <DashboardCard title="Upcoming deadlines">
                <UpcomingDeadlinesList deadlines={upcomingDeadlines} />
                </DashboardCard>
                <DashboardCard title="Recent announcements">
                <RecentAnnouncementsList announcements={recentAnnouncements} />
                </DashboardCard>
            </div>

            <DashboardCard
                title="Your courses"
                action={
                <Link href="/teacher/courses" className="text-xs font-medium text-[#1F6F5C] hover:text-[#175446]">
                    View all →
                </Link>
                }
            >
                <CoursesOverviewGrid courses={courses} />
            </DashboardCard>
        </div>
    );
}
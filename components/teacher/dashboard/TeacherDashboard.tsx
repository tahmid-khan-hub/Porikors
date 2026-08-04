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
import { ListTodo } from "lucide-react";

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
        return (
            <div className="flex flex-col max-w-2xl mx-auto gap-3 rounded-xl border border-[#DAD7CE] bg-white p-5 transition-shadow hover:shadow-sm">
                <div className="flex mx-auto h-10 w-10 items-center justify-center rounded-lg bg-[#1F6F5C]/10">
                    <ListTodo size={20} className="text-[#1F6F5C]" />
                </div>
                <div className="flex flex-col gap-1 text-center">
                    <h3 className="text-lg mt-3 font-semibold text-[#2F3A33]"> Unable to Load Dashboard</h3>
                    <p className="text-sm text-[#6B7369] leading-relaxed">
                    We couldn&apos;t load your dashboard at the moment. Please refresh the page or try again in a few minutes.
                    </p>
                </div>
            </div>
        )
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
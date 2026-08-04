"use client"
import { DashboardStats } from "@/types/teacherDashboard";
import { BookOpen, Users, FileClock, CalendarClock } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function StatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-[#DAD7CE] bg-white px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F6F5F1]">
                {icon}
            </div>
            <div>
                <div className="text-xl font-semibold text-[#1C2420]">{value}</div>
                <div className="text-xs text-[#6B7369]">{label}</div>
            </div>
        </div>
    );
}

export default function StatsGrid({ stats }: { stats: DashboardStats }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={<BookOpen size={18} className="text-[#1F6F5C]" />} label="Courses" value={stats.totalCourses} />
            <StatCard icon={<Users size={18} className="text-[#1F6F5C]" />} label="Students" value={stats.totalStudents} />
            <StatCard icon={<FileClock size={18} className="text-[#D98B3F]" />} label="Pending review" value={stats.pendingSubmissions} />
            <StatCard icon={<CalendarClock size={18} className="text-[#C1443D]" />} label="Due this week" value={stats.upcomingDeadlineCount} />
        </div>
    );
}
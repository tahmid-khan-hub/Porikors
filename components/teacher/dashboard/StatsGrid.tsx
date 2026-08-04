"use client"
import { motion } from "framer-motion";
import { DashboardStats } from "@/types/teacherDashboard";
import { BookOpen, Users, FileClock, CalendarClock } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  index: number;
}

function StatCard({ icon, label, value, index }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.3 + index * 0.2 }}
            
            className="flex items-center gap-3 rounded-xl border border-[#DAD7CE] bg-white px-4 py-4 transition-colors duration-200 hover:bg-[#1F6F5C]/5 hover:border-[#1F6F5C]/30 hover:shadow-md"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F6F5F1]">
                {icon}
            </div>
            <div>
                <div className="text-xl font-semibold text-[#1C2420]">{value}</div>
                <div className="text-xs text-[#6B7369]">{label}</div>
            </div>
        </motion.div>
    );
}

export default function StatsGrid({ stats }: { stats: DashboardStats }) {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard index={0} icon={<BookOpen size={18} className="text-[#1F6F5C]" />} label="Courses" value={stats.totalCourses} />
            <StatCard index={1} icon={<Users size={18} className="text-[#1F6F5C]" />} label="Students" value={stats.totalStudents} />
            <StatCard index={2} icon={<FileClock size={18} className="text-[#D98B3F]" />} label="Pending review" value={stats.pendingSubmissions} />
            <StatCard index={3} icon={<CalendarClock size={18} className="text-[#C1443D]" />} label="Due this week" value={stats.upcomingDeadlineCount} />
        </div>
    );
}
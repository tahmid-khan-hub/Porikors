"use client";
import { StudentDashboardStats } from "@/types/studentDashboard";
import { motion } from "framer-motion";
import { BookOpen, ClipboardList, CalendarClock, Award } from "lucide-react";

const cardConfig: {
    key: keyof StudentDashboardStats;
    label: string;
    icon: typeof BookOpen;
    iconColor: string;
    bg: string;
}[] = [
    { key: "totalCourses", label: "Enrolled Courses", icon: BookOpen, iconColor: "#1F6F5C", bg: "#1F6F5C1A" },
    { key: "pendingTasks", label: "Pending Tasks", icon: ClipboardList, iconColor: "#D98B3F", bg: "#D98B3F1A" },
    { key: "dueThisWeek", label: "Due This Week", icon: CalendarClock, iconColor: "#C1443D", bg: "#C1443D1A" },
    { key: "gradedThisMonth", label: "Graded This Month", icon: Award, iconColor: "#3B8F5C", bg: "#3B8F5C1A" },
];

export default function StudentStatsGrid({ stats }: { stats: StudentDashboardStats }) {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cardConfig.map(({ key, label, icon: Icon, iconColor, bg }, i) => (
                <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                whileHover={{ y: -2 }}
                className="rounded-lg border border-[#DAD7CE] bg-white p-4 flex items-start justify-between transition-shadow hover:shadow-sm"
                >
                    <div>
                        <p className="text-sm text-[#1C2420]/60">{label}</p>
                        <p className="text-2xl font-semibold text-[#1C2420] mt-1">{stats[key]}</p>
                    </div>
                    <div className="rounded-md p-2" style={{ backgroundColor: bg }}>
                        <Icon className="h-5 w-5" style={{ color: iconColor }} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
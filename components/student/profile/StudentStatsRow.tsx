"use client"
import { percentToLetter } from "@/lib/constants/grade";
import { StudentStats } from "@/types/profile";
import { BookOpen, CheckCircle2, ClipboardList, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentStatsRow({ stats }: { stats: StudentStats }) {
    const tiles = [
        { icon: BookOpen, label: "Courses Enrolled", value: String(stats.coursesEnrolled) },
        { icon: CheckCircle2, label: "Tasks Completed", value: String(stats.tasksCompleted) },
        { icon: ClipboardList, label: "Pending Tasks", value: String(stats.pendingTasks), accent: stats.pendingTasks > 0, },
        { icon: Award, label: "Overall Grade", value: percentToLetter(stats.overallGradePercent), },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tiles.map((tile, i) => (
                <motion.div
                    key={tile.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                    whileHover={{ y: -2 }}
                    className="rounded-lg border border-[#DAD7CE] bg-white p-4 transition-shadow hover:shadow-sm"
                    style={tile.accent ? { borderColor: "#D98B3F" } : undefined}
                >
                    <tile.icon size={16} className={tile.accent ? "text-[#D98B3F]" : "text-[#6B7369]"} />
                    <div className="mt-2 text-xl font-semibold text-[#1C2420]">{tile.value}</div>
                    <div className="text-xs text-[#6B7369]">{tile.label}</div>
                </motion.div>
            ))}
        </div>
    );
}
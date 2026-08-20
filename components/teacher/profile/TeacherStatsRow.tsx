"use client"
import { TeacherStats } from "@/types/profile";
import { BookOpen, Users, ClipboardCheck, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

export default function TeacherStatsRow({ stats }: { stats: TeacherStats }) {
    const tiles = [
        { icon: BookOpen, label: "Courses Taught", value: String(stats.coursesTaught) },
        { icon: Users, label: "Total Students", value: String(stats.totalStudents) },
        { icon: ClipboardCheck, label: "Pending Grading", value: String(stats.pendingGrading), accent: stats.pendingGrading > 0, },
        { icon: Megaphone, label: "Announcements Posted", value: String(stats.announcementsPosted) },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tiles.map((tile, i) => (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                    whileHover={{ y: -2 }}
                    key={tile.label}
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
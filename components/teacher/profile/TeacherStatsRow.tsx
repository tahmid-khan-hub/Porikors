import { TeacherStats } from "@/types/profile";
import { BookOpen, Users, ClipboardCheck, Megaphone } from "lucide-react";

export default function TeacherStatsRow({ stats }: { stats: TeacherStats }) {
    const tiles = [
        { icon: BookOpen, label: "Courses Taught", value: String(stats.coursesTaught) },
        { icon: Users, label: "Total Students", value: String(stats.totalStudents) },
        { icon: ClipboardCheck, label: "Pending Grading", value: String(stats.pendingGrading), accent: stats.pendingGrading > 0, },
        { icon: Megaphone, label: "Announcements Posted", value: String(stats.announcementsPosted) },
    ];

    return (
        <div className="grid grid-cols-4 gap-3">
            {tiles.map((tile) => (
                <div
                    key={tile.label}
                    className="rounded-lg border border-[#DAD7CE] bg-white p-4"
                    style={tile.accent ? { borderColor: "#D98B3F" } : undefined}
                >
                    <tile.icon size={16} className={tile.accent ? "text-[#D98B3F]" : "text-[#6B7369]"} />
                    <div className="mt-2 text-xl font-semibold text-[#1C2420]">{tile.value}</div>
                    <div className="text-xs text-[#6B7369]">{tile.label}</div>
                </div>
            ))}
        </div>
    );
}
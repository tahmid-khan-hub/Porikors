import { percentToLetter } from "@/lib/constants/grade";
import { StudentStats } from "@/types/profile";
import { BookOpen, CheckCircle2, ClipboardList, Award } from "lucide-react";

export default function StudentStatsRow({ stats }: { stats: StudentStats }) {
    const tiles = [
        { icon: BookOpen, label: "Courses Enrolled", value: String(stats.coursesEnrolled) },
        { icon: CheckCircle2, label: "Tasks Completed", value: String(stats.tasksCompleted) },
        { icon: ClipboardList, label: "Pending Tasks", value: String(stats.pendingTasks), accent: stats.pendingTasks > 0, },
        { icon: Award, label: "Overall Grade", value: percentToLetter(stats.overallGradePercent), },
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
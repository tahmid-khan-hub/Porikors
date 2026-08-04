"use client";
import { StudentStats } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, UserPlus, CalendarClock, ShieldQuestion } from "lucide-react";

const cardConfig: {
  key: keyof StudentStats;
  label: string;
  icon: typeof Users;
  iconColor: string;
  bg: string;
}[] = [
  { key: "totalStudents", label: "Total Students", icon: Users, iconColor: "#1F6F5C", bg: "#1F6F5C1A" },
  { key: "newThisMonth", label: "New This Month", icon: UserPlus, iconColor: "#3B8F5C", bg: "#3B8F5C1A" },
  { key: "newThisWeek", label: "New This Week", icon: CalendarClock, iconColor: "#D98B3F", bg: "#D98B3F1A" },
  { key: "pendingVerifications", label: "Pending Verifications", icon: ShieldQuestion, iconColor: "#C1443D", bg: "#C1443D1A" },
];

export default function StudentStatsCards() {
  const { data, isLoading } = useQuery<StudentStats>({
    queryKey: ["admin", "students", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/students/stats");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load stats");
      return data.stats as StudentStats;
    },
  });

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
            {isLoading ? (
              <div className="h-7 w-12 mt-1 rounded bg-[#DAD7CE] animate-pulse" />
            ) : (
              <motion.p
                key={data?.[key] ?? 0}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-2xl font-semibold text-[#1C2420] mt-1"
              >
                {data?.[key] ?? 0}
              </motion.p>
            )}
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.06 + 0.1 }}
            className="rounded-md p-2"
            style={{ backgroundColor: bg }}
          >
            <Icon className="h-5 w-5" style={{ color: iconColor }} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

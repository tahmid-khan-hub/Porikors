"use client";

import { TeacherStats } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";
import { Users, UserPlus, CalendarClock, ShieldQuestion } from "lucide-react";

const cardConfig: {
  key: keyof TeacherStats;
  label: string;
  icon: typeof Users;
}[] = [
  { key: "totalTeachers", label: "Total Teachers", icon: Users },
  { key: "newThisMonth", label: "New This Month", icon: UserPlus },
  { key: "newThisWeek", label: "New This Week", icon: CalendarClock },
  { key: "pendingVerifications", label: "Pending Verifications", icon: ShieldQuestion },
];

export default function TeacherStatsCards() {
  const { data, isLoading } = useQuery<TeacherStats>({
    queryKey: ["admin", "teachers", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/teachers/stats");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load stats");
      return data.stats as TeacherStats;
    },
  });

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cardConfig.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="rounded-lg border border-[#DAD7CE] bg-white p-4 flex items-start justify-between"
        >
          <div>
            <p className="text-sm text-[#1C2420]/60">{label}</p>
            {isLoading ? (
              <div className="h-7 w-12 mt-1 rounded bg-[#DAD7CE] animate-pulse" />
            ) : (
              <p className="text-2xl font-semibold text-[#1C2420] mt-1">
                {data?.[key] ?? 0}
              </p>
            )}
          </div>
          <div className="rounded-md bg-[#1F6F5C]/10 p-2">
            <Icon className="h-5 w-5 text-[#1F6F5C]" />
          </div>
        </div>
      ))}
    </div>
  );
}
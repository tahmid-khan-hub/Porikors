"use client"
import { ReactNode } from "react";

export default function DashboardCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
    return (
        <div className="rounded-xl border border-[#DAD7CE] bg-white p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#1C2420]">{title}</h3>
                {action}
            </div>
        {children}
        </div>
    );
}

"use client"

interface DashboardCardProps {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

export default function DashboardCard({ title, action, children }: DashboardCardProps) {
    return (
        <div className="rounded-xl border border-[#DAD7CE] bg-white p-4">
            <div className="mb-1 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#1C2420]">{title}</h2>
                {action}
            </div>
            {children}
        </div>
    );
}
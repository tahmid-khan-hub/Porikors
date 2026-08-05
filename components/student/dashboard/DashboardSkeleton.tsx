"use client"

export default function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-56 rounded-xl border border-[#DAD7CE] bg-gray-100 animate-pulse" />
                ))}
            </div>
            <div className="h-48 rounded-xl border border-[#DAD7CE] bg-gray-100 animate-pulse" />
        </div>
    );
}
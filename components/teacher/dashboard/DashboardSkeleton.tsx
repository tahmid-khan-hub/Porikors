export default function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
            ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
            <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
        </div>
        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        </div>
    );
}
export function CourseDetailSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 bg-gray-200 rounded-md" />
          <div className="h-4 w-24 bg-gray-200 rounded-md mt-1" />
        </div>
        <div className="h-9 w-28 bg-gray-200 rounded-lg shrink-0" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-4 border-b border-[#DAD7CE] pb-3">
        <div className="h-4 w-24 bg-gray-200 rounded-md" />
        <div className="h-4 w-20 bg-gray-200 rounded-md" />
        <div className="h-4 w-16 bg-gray-200 rounded-md" />
        <div className="h-4 w-16 bg-gray-200 rounded-md" />
      </div>

      {/* Textarea skeleton */}
      <div className="rounded-xl border border-[#DAD7CE] p-4 flex flex-col gap-3">
        <div className="h-28 w-full bg-gray-200 rounded-lg" />
        <div className="h-9 w-20 bg-gray-200 rounded-lg self-end" />
      </div>
    </div>
  );
}

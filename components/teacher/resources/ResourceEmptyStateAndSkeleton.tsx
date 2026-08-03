import { FolderOpen } from "lucide-react";

export function ResourcesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-[#1F6F5C]/10 p-4 mb-4">
        <FolderOpen size={28} className="text-[#1F6F5C]" />
      </div>
      <h3 className="text-sm font-medium text-[#1C2420]">No resources yet</h3>
      <p className="text-sm text-[#6B7369] mt-1">
        Add your first resource to get started.
      </p>
    </div>
  );
}

export function ResourcesSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-[#DAD7CE] bg-white p-4 space-y-3"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-[#DAD7CE] animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-[#DAD7CE] animate-pulse" />
              <div className="h-3 w-1/4 rounded bg-[#DAD7CE] animate-pulse" />
            </div>
          </div>
          <div className="h-3 w-full rounded bg-[#DAD7CE] animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-[#DAD7CE] animate-pulse" />
        </div>
      ))}
    </div>
  );
}
 
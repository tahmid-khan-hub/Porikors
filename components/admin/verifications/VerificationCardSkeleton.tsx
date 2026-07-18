export default function VerificationCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#DAD7CE] bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 shrink-0 rounded-full bg-[#DAD7CE]/60 animate-pulse" />

          <div className="min-w-0 flex flex-col gap-2">
            <div className="h-4 w-32 rounded bg-[#DAD7CE]/60 animate-pulse" />
            <div className="h-3 w-48 rounded bg-[#DAD7CE]/40 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-24 rounded-md bg-[#DAD7CE]/50 animate-pulse" />
          <div className="h-8 w-20 rounded-md bg-[#DAD7CE]/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

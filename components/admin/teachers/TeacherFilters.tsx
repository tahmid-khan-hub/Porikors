"use client";
import Dropdown from "@/components/shared/Dropdown";
import { TeacherDateRange, TeacherSortBy } from "@/types/admin";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface TeacherFiltersProps {
  sortBy: TeacherSortBy;
  dateRange: TeacherDateRange;
  onSortByChange: (value: TeacherSortBy) => void;
  onDateRangeChange: (value: TeacherDateRange) => void;
}

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Name (A–Z)", value: "name_asc" },
  { label: "Name (Z–A)", value: "name_desc" },
];

const DATE_OPTIONS = [
  { label: "All time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "week" },
  { label: "Last 30 days", value: "month" },
  { label: "This year", value: "year" },
];

export default function TeacherFilters({ sortBy, dateRange, onSortByChange, onDateRangeChange, }: TeacherFiltersProps) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;
  const currentDateLabel = DATE_OPTIONS.find(
    (o) => o.value === dateRange,
  )?.label;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1C2420]/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teachers by name or email..."
            className="w-full rounded-md border border-[#DAD7CE] bg-white py-2 pl-9 pr-3 text-sm text-[#1C2420] placeholder:text-[#1C2420]/40 focus:outline-none focus:ring-2 focus:ring-[#1F6F5C]/30"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 rounded-md border border-[#DAD7CE] bg-white px-3 py-2 text-sm text-[#1C2420] hover:bg-[#F6F5F1] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 rounded-md border border-[#DAD7CE] bg-white p-3">
          <div className="w-48">
            <Dropdown
              name="sortBy"
              label="Sort by"
              options={SORT_OPTIONS.map((o) => o.label)}
              value={currentSortLabel}
              onChange={(label) => {
                const match = SORT_OPTIONS.find((o) => o.label === label);
                if (match) onSortByChange(match.value as TeacherSortBy);
              }}
            />
          </div>

          <div className="w-48">
            <Dropdown
              name="dateRange"
              label="Joined"
              options={DATE_OPTIONS.map((o) => o.label)}
              value={currentDateLabel}
              onChange={(label) => {
                const match = DATE_OPTIONS.find((o) => o.label === label);
                if (match) onDateRangeChange(match.value as TeacherDateRange);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

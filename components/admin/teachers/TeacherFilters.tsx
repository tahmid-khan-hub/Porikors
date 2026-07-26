"use client";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import TeacherSearchBar from "./TeacherSearchBar";
import TeacherFilterDrawer from "./TeacherFilterDrawer";
import { TeacherDateRange, TeacherSortBy } from "@/types/admin";

interface TeacherFiltersProps {
  search: string;
  sortBy: TeacherSortBy;
  dateRange: TeacherDateRange;
  onSearchChange: (value: string) => void;
  onSortByChange: (value: TeacherSortBy) => void;
  onDateRangeChange: (value: TeacherDateRange) => void;
}

export default function TeacherFilters({ search, sortBy, dateRange, onSearchChange, onSortByChange, onDateRangeChange, }: TeacherFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <TeacherSearchBar search={search} onSearchChange={onSearchChange} />

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 rounded-md border border-[#DAD7CE] bg-white px-3 py-2 text-sm text-[#1C2420] hover:bg-[#F6F5F1] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <TeacherFilterDrawer
        isOpen={showFilters}
        sortBy={sortBy}
        dateRange={dateRange}
        onSortByChange={onSortByChange}
        onDateRangeChange={onDateRangeChange}
      />
    </div>
  );
}

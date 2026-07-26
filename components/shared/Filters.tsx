"use client";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import SearchBar from "./SearchBar";
import FilterDrawer, { FilterGroup } from "./FilterDrawer";

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  groups: FilterGroup[];
}

export default function Filters({ search, onSearchChange, searchPlaceholder, groups }: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onSearchChange={onSearchChange} placeholder={searchPlaceholder} />

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 rounded-md border border-[#DAD7CE] bg-white px-3 py-2 text-sm text-[#1C2420] hover:bg-[#F6F5F1] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <FilterDrawer isOpen={showFilters} groups={groups} />
    </div>
  );
}
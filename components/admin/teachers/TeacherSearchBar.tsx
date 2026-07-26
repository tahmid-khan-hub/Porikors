"use client";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TeacherSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function TeacherSearchBar({ search, onSearchChange }: TeacherSearchBarProps) {
  const [localSearch, setLocalSearch] = useState(search);

   const onSearchChangeRef = useRef(onSearchChange);
    useEffect(() => {
      onSearchChangeRef.current = onSearchChange;
    });

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        onSearchChangeRef.current(localSearch);
      }, 400);

      return () => clearTimeout(timeoutId);
    }, [localSearch]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1C2420]/40" />
      <input
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder="Search teachers by name or email..."
        className="w-full rounded-md border border-[#DAD7CE] bg-white py-2 pl-9 pr-3 text-sm text-[#1C2420] placeholder:text-[#1C2420]/40 focus:outline-none focus:ring-2 focus:ring-[#1F6F5C]/30"
      />
    </div>
  );
}
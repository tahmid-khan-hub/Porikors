"use client";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  value,
  onSearchChange,
  placeholder = "Search...",
  debounceMs = 400,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChangeRef.current(localValue);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localValue, debounceMs]); 

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1C2420]/40" />
      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#DAD7CE] bg-white py-2 pl-9 pr-3 text-sm text-[#1C2420] placeholder:text-[#1C2420]/40 focus:outline-none focus:ring-2 focus:ring-[#1F6F5C]/30"
      />
    </div>
  );
}

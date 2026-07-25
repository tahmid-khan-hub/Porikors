"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function DataTablePagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  itemLabel = "items",
}: DataTablePaginationProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[#1C2420]/60">
        Page {page} of {totalPages} &middot; {totalItems} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="border-[#DAD7CE] text-[#1C2420]"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="border-[#DAD7CE] text-[#1C2420]"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

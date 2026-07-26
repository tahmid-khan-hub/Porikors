"use client";
import Dropdown from "@/components/shared/Dropdown";
import { TeacherDateRange, TeacherSortBy } from "@/types/admin";
import { AnimatePresence, motion } from "framer-motion";

interface TeacherFilterDrawerProps {
  isOpen: boolean;
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

export default function TeacherFilterDrawer({ isOpen, sortBy, dateRange, onSortByChange, onDateRangeChange, }: TeacherFilterDrawerProps) {
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label;
  const currentDateLabel = DATE_OPTIONS.find((o) => o.value === dateRange)?.label;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="teacher-filters-drawer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
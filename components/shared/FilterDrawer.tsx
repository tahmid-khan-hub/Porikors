"use client";
import Dropdown from "@/components/shared/Dropdown";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterDrawerProps {
  isOpen: boolean;
  groups: FilterGroup[];
}

export default function FilterDrawer({ isOpen, groups }: FilterDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="filter-drawer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
          style={{ overflow: isAnimating ? "hidden" : "visible" }}
        >
          <div className="flex flex-wrap gap-4 rounded-md border border-[#DAD7CE] bg-white p-3">
            {groups.map((group) => {
              const currentLabel = group.options.find((o) => o.value === group.value)?.label;

              return (
                <div key={group.key} className="w-48">
                  <Dropdown
                    name={group.key}
                    label={group.label}
                    options={group.options.map((o) => o.label)}
                    value={currentLabel}
                    onChange={(label) => {
                      const match = group.options.find((o) => o.label === label);
                      if (match) group.onChange(match.value);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";
import { useState } from "react";
import { GraduationCap, User, Check, ArrowRight } from "lucide-react";
import { Role } from "./OnBoardingClientSide";
import { Button } from "@/components/ui/button";

interface RolePickerProps {
  onSelect: (role: Role) => void;
}

const ROLES: {
    value: Role;
    label: string;
    description: string;
     icon: typeof GraduationCap;
}[] = [
  {
    value: "teacher",
    label: "Teacher",
    description: "Create courses, grade work",
    icon: GraduationCap,
  },
  {
    value: "student",
    label: "Student",
    description: "Join courses, submit work",
    icon: User,
  },
];

export default function RolePicker({ onSelect }: RolePickerProps) {
  const [selected, setSelected] = useState<Role | null>(null);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-[#1C2420]">Who are you?</h1>
      <p className="mt-2 text-sm text-[#1C2420]/60">
        This determines what you can do on Porikors.
        <br />
        Choose the role that best fits your needs.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {ROLES.map(({ value, label, description, icon: Icon }) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={`relative flex flex-col items-center rounded-xl border bg-white px-6 py-6 transition-colors ${
                isSelected
                  ? "border-[#1F6F5C]"
                  : "border-[#DAD7CE] hover:border-[#1F6F5C]/50"
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F6F5C]/10">
                <Icon className="h-6 w-6 text-[#1F6F5C]" strokeWidth={1.75} />
              </span>

              <span className="mt-4 text-base font-semibold text-[#1C2420]">
                {label}
              </span>
              <span className="mt-1 text-xs text-[#1C2420]/50">
                {description}
              </span>

              <span
                className={`mt-4 flex h-6 w-6 items-center justify-center rounded-full transition-opacity ${
                  isSelected
                    ? "bg-[#1F6F5C] opacity-100"
                    : "bg-[#DAD7CE] opacity-0"
                }`}
              >
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        disabled={!selected}
        onClick={() => selected && onSelect(selected)}
        className="mt-10 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F6F5C] py-5 text-sm font-medium text-white transition-colors hover:bg-[#175446] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="mt-4 text-xs text-[#1C2420]/50">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-[#1F6F5C] hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}

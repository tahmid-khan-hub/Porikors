"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface GradeCellInputProps {
  score: number | null;
  maxMarks: number;
  hasPendingChange: boolean;
  onChange: (value: number | null) => void;
}

export default function GradeCellInput({ score, maxMarks, hasPendingChange, onChange, }: GradeCellInputProps) {
    const [local, setLocal] = useState<string>(score !== null ? String(score) : "");

    function commit() {
        if (local.trim() === "") {
            onChange(null);
            return;
        }
        const parsed = Number(local);
        if (Number.isNaN(parsed)) {
            setLocal(score !== null ? String(score) : "");
            return;
        }
        const clamped = Math.max(0, Math.min(parsed, maxMarks));
        setLocal(String(clamped));
        onChange(clamped);
    }

    return (
        <Input
            type="number"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            placeholder="-"
            className="h-8 w-20 text-center text-sm"
            style={
                hasPendingChange
                ? { borderColor: "#D98B3F", backgroundColor: "#FBF3E9" }
                : undefined
            }
        />
    );
}
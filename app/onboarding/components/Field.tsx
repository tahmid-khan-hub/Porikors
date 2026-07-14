"use client"
import { getStoredField, setStoredField } from "@/lib/onboardingStorage";
import { useState } from "react";

interface FieldProps {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
}

export default function Field({ name, label, type = "text", required } : FieldProps) {
    const [value, setValue] = useState(() => getStoredField(name));

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
        setStoredField(name, e.target.value);
    }
    return (
        <div>
            <label htmlFor={name} className="text-xs font-medium text-[#1C2420]/70">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                required={required}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-[#DAD7CE] bg-white px-3 py-2 text-sm text-[#1C2420] outline-none focus:border-[#1F6F5C]"
            />
        </div>
    )
}
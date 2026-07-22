"use client"
import { getStoredField, setStoredField } from "@/lib/onboardingStorage";
import { useState } from "react";

interface FieldProps {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    pattern?: string;
    title?: string;
    maxLength?: number;
    error?: string;
}

export default function Field({
    name, label, placeholder, type = "text", required, pattern, title, maxLength, error,
}: FieldProps) {
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
                placeholder={placeholder}
                required={required}
                pattern={pattern}
                title={title}
                maxLength={maxLength}
                onChange={handleChange}
                className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#1C2420] outline-none focus:border-[#1F6F5C] ${
                    error ? "border-[#C1443D]" : "border-[#DAD7CE]"
                }`}
            />
            {error && <p className="mt-1 text-xs text-[#C1443D]">{error}</p>}
        </div>
    )
}
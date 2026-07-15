"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronDown } from "react-icons/lu";

interface DropdownProps {
    name: string;
    options: string[];
    placeholder?: string;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export default function Dropdown({ name, options, placeholder, label, value, onChange, }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    

    const handleSelect = (option: string) => {
        setIsOpen(false);
        if (onChange) onChange(option);
    };

    return (
        <div className="relative">
            <input type="hidden" name={name} value={value} /> {/* hidden input to carry value in form */}
            <label htmlFor={name} className="text-xs font-medium text-[#1C2420]/70">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex w-full text-sm items-center justify-between rounded-lg border border-[#DAD7CE] bg-white text-[#1C2420] outline-none focus:border-[#1F6F5C] px-3 py-2 mt-1 text-left transition "
            >
                <span className={value ? "text-sm text-[#1C2420]" : "text-sm text-gray-600"}>
                {value || placeholder}
                </span>
                    <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[#1C2420]"
                    >
                        <LuChevronDown size={18} />
                    </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-gray-100 shadow-md"
                    >
                        {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="cursor-pointer px-4 py-3 text-[#1C2420] transition hover:bg-gray-200"
                        >
                            {option}
                        </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>  
    )
}
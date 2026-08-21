"use client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DatePickerProps {
    name: string;
    label: string;
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
}

export default function DatePicker({ name, label, value, onChange, placeholder = "Pick a date", error, required, }: DatePickerProps) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={name} className="text-xs font-medium text-[#1C2420]/70">
                {label}
            </label>

            <Popover>
                <PopoverTrigger
                    render={
                        <Button
                            id={name}
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-left font-normal text-[#1C2420]"
                        >
                            <CalendarIcon size={16} className="mr-2 text-[#6B7369]" />
                            {value ? format(value, "PPP") : (
                                <span className="text-[#8A9186]">{placeholder}</span>
                            )}
                        </Button>
                    }
                />
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={onChange}
                        captionLayout="dropdown"
                        startMonth={new Date(1950, 0)}
                        endMonth={new Date()}
                        disabled={(date) => date > new Date()}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>

            <input type="hidden" name={name} value={value ? value.toISOString() : ""} />

            {error && <p className="text-xs text-[#C1443D]">{error}</p>}
        </div>
    );
}
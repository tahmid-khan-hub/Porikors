"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Pencil, Phone, VenetianMask } from "lucide-react";
import { TeacherIdentity } from "@/types/profile";
import Image from "next/image";
import TeacherProfileHeaderEditForm from "./TeacherProfileHeaderEditForm";
import { motion } from "framer-motion";
import { formatDob } from "@/lib/formatDateOfBirth";

interface TeacherProfileHeaderProps {
    identity: TeacherIdentity;
    queryKey: unknown[];
}

export default function TeacherProfileHeader({ identity, queryKey }: TeacherProfileHeaderProps) {
    const [editing, setEditing] = useState(false);

    if (editing) {
        return (
            <TeacherProfileHeaderEditForm
                identity={identity}
                queryKey={queryKey}
                onDone={() => setEditing(false)}
            />
        );
    }

    const dobFormatted = formatDob(identity.dateOfBirth);
    return (
        <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06, ease: "easeOut" }}
        whileHover={{ y: -2 }}
        className="flex flex-col md:flex-row items-center justify-between rounded-xl border border-[#DAD7CE] bg-white shadow-sm p-6">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[#DAD7CE] overflow-hidden">
                    {identity.image ? (
                        <Image src={identity.image} alt={identity.name} height={64} width={64} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-[#6B7369] text-lg font-medium">
                        {identity.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-[#1C2420]">{identity.name}</h2>
                        <span className="text-xs font-medium text-[#1F6F5C] border border-[#1F6F5C] rounded-full px-2 py-0.5">Teacher</span>
                    </div>
                    <p className="text-sm text-[#6B7369]">{identity.email}</p>
                    <p className="text-sm text-[#6B7369]">{identity.institution}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        {identity.phoneNumber && (
                            <span className="flex items-center gap-1 text-xs text-[#6B7369]">
                                <Phone size={12} /> {identity.phoneNumber}
                            </span>
                        )}
                        {identity.gender && (
                            <span className="flex items-center gap-1 text-xs text-[#6B7369]">
                                <VenetianMask size={12} /> {identity.gender}
                            </span>
                        )}
                        {dobFormatted && (
                            <span className="flex items-center gap-1 text-xs text-[#6B7369]">
                                <CalendarDays size={12} /> {dobFormatted}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <Button variant="outline" onClick={() => setEditing(true)} className="shrink-0 mt-5 md:mt-0">
                <Pencil size={14} className="mr-1.5" /> Edit Profile
            </Button>
        </motion.div>
    );
}
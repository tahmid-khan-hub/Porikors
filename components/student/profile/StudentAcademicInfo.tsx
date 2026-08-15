"use client"
import { StudentAcademicInfo as AcademicInfoType } from "@/types/profile";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const STATUS_CONFIG = {
    approved: { label: "Verified", color: "#3B8F5C", bg: "#EAF4EC", icon: CheckCircle2 },
    pending: { label: "Pending Review", color: "#D98B3F", bg: "#FBF3E9", icon: Clock },
    rejected: { label: "Rejected", color: "#C1443D", bg: "#FBEAE9", icon: XCircle },
    unset: { label: "Unverified", color: "#6B7369", bg: "#F6F5F1", icon: Clock },
} 

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div>
            <div className="text-xs text-[#6B7369]">{label}</div>
            <div className={`text-sm text-[#1C2420] ${mono ? "font-mono" : "font-medium"}`}>{value}</div>
        </div>
    );
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function StudentAcademicInfo({ academic }: { academic: AcademicInfoType }) {
    const status = STATUS_CONFIG[academic.verificationStatus];
    const StatusIcon = status.icon;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06, ease: "easeOut" }}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-[#DAD7CE] bg-white p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#1C2420]">Academic Information</h3>
                <span
                className="inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1"
                style={{ color: status.color, backgroundColor: status.bg }}
                >
                    <StatusIcon size={12} /> {status.label}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <Field label="Student ID" value={academic.studentId ?? "-"} mono />
                <Field label="Enrollment Date" value={formatDate(academic.memberSince)} />
                <Field label="Institution" value={academic.institution} />
                <Field label="Department" value={academic.department ?? "-"} />
            </div>

            {academic.idCardUrl && (
                <div className="mt-5 flex items-center gap-3">
                    <div className="h-14 w-20 rounded-md border border-[#DAD7CE] overflow-hidden bg-[#F6F5F1]">
                        <Image src={academic.idCardUrl} alt="ID card" width={100} height={100} className="h-full w-full object-cover" />
                    </div>
                    <a
                        href={academic.idCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#1F6F5C] hover:text-[#175446]"
                    >
                        View full size
                    </a>
                </div>
            )}
        </motion.div>
    );
}

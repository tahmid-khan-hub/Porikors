"use client"
import { TeacherAcademicInfo as TeacherAcademicInfoType } from "@/types/profile";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const STATUS_CONFIG = {
    approved: { label: "Verified", color: "#3B8F5C", bg: "#EAF4EC", icon: CheckCircle2 },
    pending: { label: "Pending Review", color: "#D98B3F", bg: "#FBF3E9", icon: Clock },
    rejected: { label: "Rejected", color: "#C1443D", bg: "#FBEAE9", icon: XCircle },
    unset: { label: "Unverified", color: "#6B7369", bg: "#F6F5F1", icon: Clock },
} 

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-xs text-[#6B7369]">{label}</div>
            <div className="text-sm text-[#1C2420] font-medium">{value}</div>
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

export default function TeacherAcademicInfo({ academic }: { academic: TeacherAcademicInfoType }) {
    const status = STATUS_CONFIG[academic.verificationStatus];
    const StatusIcon = status.icon;

    return (
        <div className="rounded-xl border border-[#DAD7CE] bg-white p-6">
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
                <Field label="Designation" value={academic.designation ?? "-"} />
                <Field label="Department" value={academic.department ?? "-"} />
                <Field label="Institution" value={academic.institution} />
                <Field label="Work Email" value={academic.workEmail ?? "-"} />
                <Field label="Joined" value={formatDate(academic.memberSince)} />
            </div>
        </div>
    );
}


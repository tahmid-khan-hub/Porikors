import { formatDob } from "@/lib/formatDateOfBirth";
import { Verification } from "@/types/AdminVerification";
import { ExternalLink } from "lucide-react";

interface VerificationDetailContentProps {
    verification: Verification;
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-[#1C2420]/50">{label}</span>
            <span className="text-sm text-[#1C2420]">{value}</span>
        </div>
    );
}

export default function VerificationDetailContent({ verification }: VerificationDetailContentProps) {
    const dob = formatDob(verification.date_of_birth);

    return (
        <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Email" value={verification.email} />
                <DetailRow label="Phone number" value={verification.phone_number} />
                <DetailRow label="Gender" value={verification.gender} />
                <DetailRow label="Date of birth" value={dob} />
                <DetailRow label="Institution" value={verification.institution} />
                <DetailRow label="Department" value={verification.department} />

                {verification.requested_role === "teacher" ? (
                    <>
                        <DetailRow label="Designation" value={verification.designation} />
                        <DetailRow label="Work email" value={verification.work_email} />
                    </>
                ) : (
                    <DetailRow label="Student ID number" value={verification.student_id_number} />
                    )}
            </div>

            {verification.id_card_url ? (
                <a
                    href={verification.id_card_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1F6F5C] hover:underline"
                >
                    View ID card <ExternalLink size={13} />
                </a>
            ) : (
                <p className="text-xs text-[#D98B3F]">No ID card uploaded.</p>
            )}
        </div>
    );
}
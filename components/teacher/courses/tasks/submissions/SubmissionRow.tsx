"use client";
import { StudentSubmissionRow } from "@/types/submission";
import { FileText, Paperclip, ExternalLink } from "lucide-react";

type StatusStyle = {
    bg: string;
    text: string;
    label: string;
};

const STATUS_STYLES: { [key: string]: StatusStyle } = {
    not_submitted: { bg: "#F6F5F1", text: "#6B7369", label: "Not submitted" },
    submitted: { bg: "#EAF4EF", text: "#1F6F5C", label: "Submitted" },
    late: { bg: "#FBF3E9", text: "#D98B3F", label: "Late" },
    graded: { bg: "#EDF7EF", text: "#3B8F5C", label: "Graded" },
    resubmission_requested: { bg: "#FBEAE9", text: "#C1443D", label: "Resubmission requested" },
    resubmitted: { bg: "#EAF4EF", text: "#1F6F5C", label: "Resubmitted" },
};

interface SubmissionRowProps {
    row: StudentSubmissionRow;
    maxMarks: number | null;
    onGrade: (row: StudentSubmissionRow) => void;
    onRequestResubmission: (row: StudentSubmissionRow) => void;
}

export default function SubmissionRow({ row, maxMarks, onGrade, onRequestResubmission }: SubmissionRowProps) {
    const style = STATUS_STYLES[row.status] ?? STATUS_STYLES.not_submitted;
    const canGrade = row.submission_id !== null;

    return (
        <div className="flex items-center justify-between gap-4 border-b border-[#DAD7CE] px-4 py-3 last:border-0">
            <div className="min-w-0 flex-1">
                <div className="font-medium text-[#1C2420]">{row.student_name}</div>
                <div className="text-xs text-[#6B7369]">{row.student_email}</div>
            </div>

            <span
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: style.bg, color: style.text }}
            >
                {style.label}
            </span>

            <div className="w-32 text-xs text-[#6B7369]">
                {row.submitted_at ? new Date(row.submitted_at).toLocaleString() : "—"}
            </div>

            <div className="flex w-40 items-center gap-2 text-sm">
                {row.file_url && (
                    <a
                        href={row.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#1F6F5C] hover:underline"
                    >
                        <Paperclip size={13} /> File <ExternalLink size={11} />
                    </a>
                )}
                {row.content_text && !row.file_url && (
                    <span className="flex items-center gap-1 text-[#6B7369]">
                        <FileText size={13} /> Text
                    </span>
                )}
            </div>

            <div className="w-20 text-center text-sm text-[#1C2420]">
                {row.grade !== null ? `${row.grade} / ${maxMarks ?? "-"}` : "-"}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onGrade(row)}
                    disabled={!canGrade}
                    className="rounded-md border border-[#DAD7CE] px-3 py-1.5 text-xs font-medium text-[#1C2420] hover:bg-[#F6F5F1] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {row.status === "graded" ? "Edit grade" : "Grade"}
                </button>
                {canGrade && row.status !== "resubmission_requested" && (
                    <button
                        onClick={() => onRequestResubmission(row)}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-[#C1443D] hover:bg-[#FBEAE9]"
                    >
                        Request resubmission
                    </button>
                )}
            </div>
        </div>
    );
}
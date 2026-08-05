"use client";
import { Dispatch, SetStateAction } from "react";
import { StudentTaskDetail } from "@/types/studentTaskDetail";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, X } from "lucide-react";

interface TaskSubmissionEditorProps {
    task: StudentTaskDetail;
    requiresFile: boolean;
    isPastDeadline: boolean;
    textContent: string;
    setTextContent: Dispatch<SetStateAction<string>>;
    acceptAttr: string;
    file: File | null;
    setFile: Dispatch<SetStateAction<File | null>>;
    uploading: boolean;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export default function TaskSubmissionEditor({
    task, requiresFile, isPastDeadline, textContent, setTextContent, acceptAttr,
    file, setFile, uploading, isSubmitting, onSubmit,
}: TaskSubmissionEditorProps) {
    return (
        <div className="flex flex-col gap-4 rounded-lg border border-[#DAD7CE] bg-white p-5">
        <h3 className="text-sm font-medium text-[#1C2420]">
            {task.submission ? "Update your submission" : "Submit your work"}
        </h3>

        {isPastDeadline && !task.submission && (
            <p className="rounded-md bg-[#D98B3F]/10 px-3 py-2 text-xs text-[#D98B3F]">
            The deadline has passed. You can still submit, but it will be marked late.
            </p>
        )}

        {!requiresFile ? (
            <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Write your answer here..."
            rows={8}
            className="resize-none"
            />
        ) : (
            <div className="flex flex-col gap-2">
            {task.allowed_file_types && (
                <p className="text-xs text-[#6B7369]">
                Allowed: {task.allowed_file_types.join(", ")}
                </p>
            )}

            {task.submission?.file_name && !file && (
                <div className="flex items-center justify-between rounded-md border border-[#DAD7CE] px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-[#1C2420]">
                    <FileText size={14} />
                    {task.submission.file_name} (current)
                </span>
                </div>
            )}

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#DAD7CE] py-8 transition-colors hover:border-[#1F6F5C]/40">
                <UploadCloud size={22} className="text-[#6B7369]" />
                <span className="text-sm text-[#6B7369]">
                {file ? file.name : "Click to choose a file"}
                </span>
                <input
                type="file"
                accept={acceptAttr}
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
            </label>

            {file && (
                <button
                type="button"
                onClick={() => setFile(null)}
                className="flex items-center gap-1 self-start text-xs text-[#C1443D]"
                >
                <X size={12} />
                Remove selected file
                </button>
            )}
            </div>
        )}

        <Button
            onClick={onSubmit}
            disabled={
            isSubmitting ||
            uploading ||
            (!requiresFile && !textContent.trim())
            }
            className="self-end bg-[#1F6F5C] text-white hover:bg-[#175446]"
        >
            {uploading ? "Uploading..." : isSubmitting ? "Submitting..." : task.submission ? "Resubmit" : "Submit"}
        </Button>
        </div>
    );
}
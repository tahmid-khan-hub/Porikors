"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StudentSubmissionRow } from "@/types/submission";

interface GradeSubmissionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    submission: StudentSubmissionRow | null;
    maxMarks: number | null;
    onSubmit: (values: { grade: number | null; feedback: string }) => void;
    isSubmitting: boolean;
}

export default function GradeSubmissionDialog({ open, onOpenChange, submission, maxMarks, onSubmit, isSubmitting, }: GradeSubmissionDialogProps) {
    const [grade, setGrade] = useState<string>(
        submission?.grade !== null && submission?.grade !== undefined ? String(submission.grade) : ""
    );
    const [feedback, setFeedback] = useState<string>(submission?.feedback ?? "");

    function handleSubmit() {
        const parsed = grade.trim() === "" ? null : Number(grade);
        if (parsed !== null && (Number.isNaN(parsed) || parsed < 0)) {
            toast.error("Enter a valid, non-negative grade");
            return;
        }
        if (maxMarks !== null && parsed !== null && parsed > maxMarks) {
            toast.error(`Grade cannot exceed ${maxMarks}`);
            return;
        }
        onSubmit({ grade: parsed, feedback: feedback.trim() });
    }

    if (!submission) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Grade — {submission.student_name}</DialogTitle></DialogHeader>

                <div className="space-y-4 py-2">
                    {submission.content_text && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#1C2420]">Submitted text</label>
                            <div className="max-h-40 overflow-y-auto rounded-md border border-[#DAD7CE] bg-[#F6F5F1] p-3 font-mono text-xs text-[#1C2420]">
                                {submission.content_text}
                            </div>
                        </div>
                    )}

                    {submission.file_url && (
                        <a
                            href={submission.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#1F6F5C] hover:underline"
                        >
                            Open submitted file →
                        </a>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#1C2420]">
                            Grade {maxMarks !== null && <span className="text-[#6B7369]">(out of {maxMarks})</span>}
                        </label>
                        <Input
                            type="number"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="-"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#1C2420]">Feedback (optional)</label>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Add feedback for the student..."
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#1F6F5C] hover:bg-[#175446] text-white"
                    >
                        {isSubmitting ? "Saving..." : "Save Grade"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
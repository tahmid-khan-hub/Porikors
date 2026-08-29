"use client";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTaskSubmissions } from "@/lib/api/fetchTaskSubmissions";
import { gradeSubmission, requestResubmission } from "@/lib/actions/submissionActions";
import { StudentSubmissionRow } from "@/types/submission";
import { toast } from "sonner";
import SubmissionRow from "./SubmissionRow";
import GradeSubmissionDialog from "./GradeSubmissionDialog";
import { Users } from "lucide-react";

export default function TaskSubmissionsView({ courseId, taskId }: { courseId: string; taskId: string }) {
    const queryClient = useQueryClient();
    const queryKey = ["task-submissions", courseId, taskId];

    const { data, isLoading, isError } = useQuery({ queryKey, queryFn: () => fetchTaskSubmissions(courseId, taskId), });

    const [selected, setSelected] = useState<StudentSubmissionRow | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const gradeMutation = useMutation({
        mutationFn: (values: { grade: number | null; feedback: string }) => {
            if (!selected?.submission_id) throw new Error("No submission selected");
            return gradeSubmission(selected.submission_id, { ...values, version: selected.version });
        },
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Grade saved");
                queryClient.invalidateQueries({ queryKey });
                setDialogOpen(false);
                setSelected(null);
            } else {
                toast.error(result.error);
                if (result.conflictVersion !== undefined) queryClient.invalidateQueries({ queryKey });
            }
        },
        onError: () => toast.error("Failed to save grade"),
    });

    const resubmitMutation = useMutation({
        mutationFn: (submissionId: string) => requestResubmission(submissionId),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Resubmission requested");
                queryClient.invalidateQueries({ queryKey });
            } else toast.error(result.error);
        },
        onError: () => toast.error("Failed to request resubmission"),
    });

    const submittedCount = useMemo(
        () => (data?.submissions ?? []).filter((s) => s.status !== "not_submitted").length, [data]
    );

    if (isLoading) { return <div className="h-64 w-full rounded-lg border border-[#DAD7CE] bg-gray-100 animate-pulse" />; }

    if (isError || !data) { return <div className="text-sm text-[#C1443D]">Failed to load submissions.</div>; }

    const { task, submissions } = data;

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-[#DAD7CE] bg-white p-5">
                <h1 className="text-lg font-medium text-[#1C2420]">{task.title}</h1>
                {task.description && <p className="mt-1 text-sm text-[#6B7369]">{task.description}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#6B7369]">
                    {task.deadline && <span>Deadline: {new Date(task.deadline).toLocaleString()}</span>}
                    {task.max_marks !== null && <span>Max marks: {task.max_marks}</span>}
                    <span className="flex items-center gap-1">
                        <Users size={13} /> {submittedCount} / {submissions.length} submitted
                    </span>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#DAD7CE] bg-white">
                {submissions.map((row) => (
                    <SubmissionRow
                        key={row.student_id}
                        row={row}
                        maxMarks={task.max_marks}
                        onGrade={(r) => { setSelected(r); setDialogOpen(true); }}
                        onRequestResubmission={(r) => {
                            if (r.submission_id) resubmitMutation.mutate(r.submission_id);
                        }}
                    />
                ))}
            </div>

            <GradeSubmissionDialog
                key={dialogOpen ? (selected?.submission_id ?? "new") : "closed"}
                open={dialogOpen}
                onOpenChange={(open) => { setDialogOpen(open); if (!open) setSelected(null); }}
                submission={selected}
                maxMarks={task.max_marks}
                onSubmit={(values) => gradeMutation.mutate(values)}
                isSubmitting={gradeMutation.isPending}
            />
        </div>
    );
}
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StudentTaskDetail } from "@/types/studentTaskDetail";
import { submitTask } from "@/lib/actions/submitTask";
import TaskSubmissionView from "./TaskSubmissionView";
import TaskSubmissionEditor from "./TaskSubmissionEditor";
import { buildAcceptAttr } from "@/lib/allowedFileTypes";

export default function TaskSubmissionForm({ task }: { task: StudentTaskDetail }) {
    const queryClient = useQueryClient();
    const requiresFile = !!task.allowed_file_types && task.allowed_file_types.length > 0;
    const acceptAttr = buildAcceptAttr(task.allowed_file_types);

    const [textContent, setTextContent] = useState(task.submission?.text_content ?? "");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const isPastDeadline = new Date() > new Date(task.deadline);
    const isGraded = task.submission?.status === "graded";
    // const canEdit = !isGraded; // late submissions are still allowed, just flagged "late" server-side

    const submitMutation = useMutation({
        mutationFn: async () => {
            let fileUrl = task.submission?.file_url ?? null;
            let fileName = task.submission?.file_name ?? null;

            if (file) {
                setUploading(true);
                const formData = new FormData();
                formData.append("file", file);
                formData.append("taskId", task.id);
                const uploadRes = await fetch("/api/student/upload", { method: "POST", body: formData });
                setUploading(false);
                if (!uploadRes.ok) {
                    const err = await uploadRes.json().catch(() => null);
                    throw new Error(err?.error ?? "File upload failed");
                }
                const uploadData = await uploadRes.json();
                fileUrl = uploadData.url;
                fileName = file.name;
            }

            return submitTask({
                taskId: task.id,
                courseId: task.course_id,
                textContent: requiresFile ? null : textContent,
                fileUrl,
                fileName,
            });
        },
        onSuccess: (result) => {
            if (result.success) {
                toast.success(result.data.status === "late" ? "Submitted (late)" : "Submitted");
                queryClient.invalidateQueries({ queryKey: ["student", "task", task.id] });
                queryClient.invalidateQueries({ queryKey: ["student", "course", task.course_id, "tasks"] });
            } else toast.error(result.error);
        },
        onError: () => toast.error("Submission failed"),
    });

    if (isGraded) { <TaskSubmissionView task={task} /> }

    return (
        <TaskSubmissionEditor
            task={task}
            requiresFile={requiresFile}
            isPastDeadline={isPastDeadline}
            textContent={textContent}
            setTextContent={setTextContent}
            acceptAttr={acceptAttr}
            file={file}
            setFile={setFile}
            uploading={uploading}
            isSubmitting={submitMutation.isPending}
            onSubmit={() => submitMutation.mutate()}
        />
    )
}

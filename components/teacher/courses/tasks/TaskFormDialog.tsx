"use client"
import { Task, TaskFormValues } from "@/types/task";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskFormFields from "./TaskFormFields";
import { useTaskAttachmentUpload } from "@/app/hooks/useTaskAttachmentUpload";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask: Task | null;
  onSubmit: (values: TaskFormValues) => void;
  isSubmitting: boolean;
}

function buildInitialForm(initialTask: Task | null): TaskFormValues {
  if (!initialTask) {
    return {
      title: "",
      description: null,
      allowed_file_types: null,
      deadline: "",
      max_marks: null,
      attachment_url: null,
      attachment_name: null,
    };
  }
  return {
    title: initialTask.title,
    description: initialTask.description,
    allowed_file_types: initialTask.allowed_file_types,
    deadline: initialTask.deadline.slice(0, 16),
    max_marks: initialTask.max_marks,
    attachment_url: initialTask.attachment_url,
    attachment_name: initialTask.attachment_name,
  };
}

export default function TaskFormDialog({ open, onOpenChange, initialTask, onSubmit, isSubmitting, }: TaskFormDialogProps) {
  const [form, setForm] = useState<TaskFormValues>(() => buildInitialForm(initialTask));
  const attachmentUpload = useTaskAttachmentUpload(setForm);

  function handleSubmit() {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.deadline) { toast.error("Deadline is required"); return; }

    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialTask ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>

        <TaskFormFields form={form} setForm={setForm} attachmentUpload={attachmentUpload}  />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || attachmentUpload.uploading}
            className="bg-[#1F6F5C] hover:bg-[#175446] text-white"
          >
            {isSubmitting ? "Saving..." : initialTask ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
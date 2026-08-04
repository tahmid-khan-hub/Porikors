"use client";
import { AllowedFileType, TaskFormValues } from "@/types/task";
import TaskFormContent from "./TaskFormContent";

interface TaskFormFieldsProps {
  form: TaskFormValues;
  setForm: React.Dispatch<React.SetStateAction<TaskFormValues>>;
}

const fileTypeOptions: AllowedFileType[] = [ "pdf", "doc", "docx", "zip", "image", "code", "text", "any", ];

export default function TaskFormFields({ form, setForm }: TaskFormFieldsProps) {
  function toggleFileType(ft: AllowedFileType) {
    setForm((prev) => {
      const current = prev.allowed_file_types ?? [];
      const next = current.includes(ft) ? current.filter((f) => f !== ft) : [...current, ft];
      return { ...prev, allowed_file_types: next.length > 0 ? next : null };
    });
  }

  return (
    <TaskFormContent
      form={form}
      setForm={setForm}
      fileTypeOptions={fileTypeOptions}
      toggleFileType={toggleFileType}
    />
  );
}

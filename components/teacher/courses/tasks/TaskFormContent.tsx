"use client";
import { AllowedFileType, TaskFormValues } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTaskAttachmentUpload } from "@/app/hooks/useTaskAttachmentUpload";
import { Paperclip, X } from "lucide-react";

interface TaskFormContentProps {
  form: TaskFormValues;
  setForm: React.Dispatch<React.SetStateAction<TaskFormValues>>;
  fileTypeOptions: AllowedFileType[];
  toggleFileType: (ft: AllowedFileType) => void;
  attachmentUpload: ReturnType<typeof useTaskAttachmentUpload>;
}

export default function TaskFormContent({ form, setForm, fileTypeOptions, toggleFileType, attachmentUpload }: TaskFormContentProps) {
  const { uploading, fileInputRef, handleFileSelect, clearAttachment } = attachmentUpload;
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1C2420]">Title</label>
        <Input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Assignment 1"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1C2420]">Description</label>
        <Textarea
          value={form.description ?? ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value || null }))
          }
          placeholder="Optional instructions for students"
          wrap="soft"
          className="max-h-40 overflow-y-auto resize-none w-full max-w-full break-all wrap:anywhere"
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1C2420]">Attachment (optional)</label>
        {form.attachment_url ? (
          <div className="flex items-center justify-between rounded-md border border-[#DAD7CE] px-3 py-2 text-sm">
            <span className="flex items-center gap-2 truncate text-[#1C2420]">
              <Paperclip size={14} className="text-[#6B7369] shrink-0" />
              <span className="truncate">{form.attachment_name ?? "Attached file"}</span>
            </span>
            <button type="button" onClick={clearAttachment} className="text-[#6B7369] hover:text-[#C1443D] shrink-0">
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.zip"
              onChange={handleFileSelect}
              className="hidden"
              id="task-attachment-input"
            />
            <label
              htmlFor="task-attachment-input"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-[#DAD7CE] px-3 py-2 text-sm text-[#6B7369] hover:border-[#1F6F5C] hover:text-[#1F6F5C]"
            >
              <Paperclip size={14} />
              {uploading ? "Uploading..." : "Attach assignment file"}
            </label>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1C2420]">Deadline</label>
          <Input
            type="datetime-local"
            value={form.deadline}
            onChange={(e) =>
              setForm((p) => ({ ...p, deadline: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1C2420]">Max Marks</label>
          <Input
            type="number"
            value={form.max_marks ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, max_marks: e.target.value ? Number(e.target.value) : null,
              }))
            }
            placeholder="100"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1C2420]">Allowed File Types</label>
        <div className="flex flex-wrap gap-2">
            {fileTypeOptions.map((ft) => {
                const active = form.allowed_file_types?.includes(ft) ?? false;
                return (
                <button
                    key={ft}
                    type="button"
                    onClick={() => toggleFileType(ft)}
                    className="rounded-full border px-3 py-1 text-xs"
                    style={
                    active
                        ? {
                            backgroundColor: "#1F6F5C",
                            color: "white",
                            borderColor: "#1F6F5C",
                        }
                        : { borderColor: "#DAD7CE", color: "#6B7369" }
                    }
                >
                    {ft}
                </button>
                );
            })}
        </div>
      </div>
    </div>
  );
}

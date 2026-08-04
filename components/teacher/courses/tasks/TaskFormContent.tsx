"use client";
import { AllowedFileType, TaskFormValues } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TaskFormContentProps {
  form: TaskFormValues;
  setForm: React.Dispatch<React.SetStateAction<TaskFormValues>>;
  fileTypeOptions: AllowedFileType[];
  toggleFileType: (ft: AllowedFileType) => void;
}

export default function TaskFormContent({ form, setForm, fileTypeOptions, toggleFileType, }: TaskFormContentProps) {
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

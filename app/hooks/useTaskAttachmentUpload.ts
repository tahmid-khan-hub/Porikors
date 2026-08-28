"use client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadTaskAttachment } from "@/lib/api/uploadTaskAttachment";
import { TaskFormValues } from "@/types/task";

export function useTaskAttachmentUpload(
    setForm: React.Dispatch<React.SetStateAction<TaskFormValues>>
) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { url, name } = await uploadTaskAttachment(file);
            setForm((prev) => ({ ...prev, attachment_url: url, attachment_name: name }));
            toast.success("File attached");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function clearAttachment() {
        setForm((prev) => ({ ...prev, attachment_url: null, attachment_name: null }));
    }

    return { uploading, fileInputRef, handleFileSelect, clearAttachment };
}
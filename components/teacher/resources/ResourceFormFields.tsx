"use client"
import { ResourceFormValues, ResourceType } from "@/types/resources";
import { toast } from "sonner";
import ResourceFormContent from "./ResourceFormContent";

interface ResourceFormFieldsProps {
    form: ResourceFormValues;
    setForm: React.Dispatch<React.SetStateAction<ResourceFormValues>>;
    uploading: boolean;
    setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const typeOptions: {value: ResourceType; label: string}[] = [
    { value: "video_link", label: "Video Link" },
    { value: "drive_link", label: "Drive Link" },
    { value: "pdf", label: "PDF Upload" },
    { value: "file", label: "File Upload" },
    { value: "text", label: "Text Note" },
]

export default function ResourceFormFields ({ form, setForm, uploading, setUploading }: ResourceFormFieldsProps) {
    const needsUpload = form.resource_type === "pdf" || form.resource_type === "file";
    const needsText = form.resource_type === "text";

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if(!file) return;

        const allowedFileTypes =  [".pdf", ".doc", ".docx", ".txt"]
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        if (!allowedFileTypes.includes(ext)) {
            toast.error("Only PDF, DOC, DOCX, or TXT files are allowed");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/teacher/resources/upload", {
                method: "POST", body: formData,
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");

            setForm((prev) => ({ ...prev, url: data.url }))
            toast.success("File uploaded");
        } catch { toast.error("Failed to upload file") } 

        finally { setUploading(false); }
    }

    return (
        <ResourceFormContent
            form={form}
            setForm={setForm}
            uploading={uploading}
            needsUpload={needsUpload}
            needsText={needsText}
            handleFileChange={handleFileChange}
            typeOptions={typeOptions}
        />
    )
}
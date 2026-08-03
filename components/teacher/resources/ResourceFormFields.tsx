"use client"
import { ResourceFormValues, ResourceType } from "@/types/resources";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
        <div className="space-y-4 py-2">
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1C2420]">Title</label>
                <Input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Chapter 3 slides"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1C2420]">Description</label>
                <Textarea
                    value={form.description ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value || null }))}
                    placeholder="Optional context for students"
                    rows={3}
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1C2420]">Type</label>
                <Select
                    value={form.resource_type}
                    onValueChange={(value) =>
                        setForm((p) => ({ ...p, resource_type: value as ResourceType, url: null, text_content: null }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {typeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {(form.resource_type === "video_link" || form.resource_type === "drive_link") && (
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1C2420]">URL</label>
                    <Input
                        value={form.url ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, url: e.target.value || null }))}
                        placeholder="https://..."
                    />
                </div>
            )}

            {needsUpload && (
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1C2420]">File</label>
                    <Input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} disabled={uploading} />
                        {uploading && <p className="text-xs text-[#6B7369]">Uploading...</p>}
                        {form.url && !uploading && (
                            <p className="text-xs text-[#3B8F5C]">File uploaded successfully</p>
                        )}
                </div>
            )}

            {needsText && (
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1C2420]">Text Content</label>
                    <Textarea
                        value={form.text_content ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, text_content: e.target.value || null }))}
                        rows={4}
                    />
                </div>
            )}
        </div>
    )
}
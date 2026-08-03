"use client"
import { Resource, ResourceFormValues } from "@/types/resources";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ResourceFormFields from "./ResourceFormFields";

interface ResourceFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialResource: Resource | null;
    onSubmit: (values: ResourceFormValues) => void;
    isSubmitting: boolean;
}

function buildInitialForm (initialResource: Resource | null): ResourceFormValues {
    if(!initialResource) {
        return {
            title: "",
            description: null,
            resource_type: "video_link",
            url: null,
            text_content: null,
        };
    }
    return {
        title: initialResource.title,
        description: initialResource.description,
        resource_type: initialResource.resource_type,
        url: initialResource.url,
        text_content: initialResource.text_content,
    }
}

export default function ResourceFormDialog ({
    open,
    onOpenChange,
    initialResource,
    onSubmit,
    isSubmitting,
}: ResourceFormDialogProps) {
    const [form, setForm] = useState<ResourceFormValues>(() => buildInitialForm(initialResource))
    const [uploading, setUploading] = useState(false);

    const needsUpload = form.resource_type === "pdf" || form.resource_type === "file";
    const needsUrl = needsUpload || form.resource_type === "video_link" || form.resource_type === "drive_link";
    const needsText = form.resource_type === "text";
    
    function handleSubmit() {
        if (!form.title.trim()) { toast.error("Title is required"); return; }

        if (needsUrl && !form.url) { toast.error(needsUpload ? "Please upload a file" : "URL is required"); return; }

        if (needsText && !form.text_content?.trim()) { toast.error("Text content is required"); return; }

        onSubmit(form);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{initialResource ? "Edit Resource" : "Add Resource"}</DialogTitle>
                    </DialogHeader>

                    <ResourceFormFields
                        form={form}
                        setForm={setForm}
                        uploading={uploading}
                        setUploading={setUploading}
                    />

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || uploading}
                            className="bg-[#1F6F5C] hover:bg-[#175446] text-white"
                        >
                            {isSubmitting ? "Saving..." : initialResource ? "Save Changes" : "Add Resource"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
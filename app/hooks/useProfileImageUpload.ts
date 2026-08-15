"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserImage } from "@/lib/actions/profileActions";

export function useProfileImageUpload(queryKey: unknown[]) {
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);

    const saveImageMutation = useMutation({
        mutationFn: (url: string) => updateUserImage(url),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Profile photo updated");
                queryClient.invalidateQueries({ queryKey });
            } else { toast.error(result.error); }
        },
        onError: () => toast.error("Failed to save photo"),
        onSettled: () => setIsUploading(false),
    });

    async function handleFileSelected(file: File) {
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5MB");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/user/image-upload", { method: "POST", body: formData });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error ?? "Upload failed");
                setIsUploading(false);
                return;
            }

            saveImageMutation.mutate(data.url);
        } catch {
            toast.error("Upload failed");
            setIsUploading(false);
        }
    }

    return { handleFileSelected, isUploading };
}
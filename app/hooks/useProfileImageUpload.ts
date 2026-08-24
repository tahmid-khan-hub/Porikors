"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateUserImage, deleteUserImage } from "@/lib/actions/profileActions";

export function useProfileImageUpload(queryKey: unknown[]) {
    const queryClient = useQueryClient();
    const { update } = useSession();
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const saveImageMutation = useMutation({
        mutationFn: (url: string) => updateUserImage(url),
        onSuccess: async (result) => {
            if (result.success) {
                toast.success("Profile photo updated");
                queryClient.invalidateQueries({ queryKey });
                await update({ image: result.data.image });
                router.refresh();
            } else { toast.error(result.error); }
        },
        onError: () => toast.error("Failed to save photo"),
        onSettled: () => setIsUploading(false),
    });

    const deleteImageMutation = useMutation({
        mutationFn: () => deleteUserImage(),
        onSuccess: async (result) => {
            if (result.success) {
                toast.success("Profile photo removed");
                queryClient.invalidateQueries({ queryKey });
                await update({ image: null });
                router.refresh();
            } else { toast.error(result.error); }
        },
        onError: () => toast.error("Failed to remove photo"),
        onSettled: () => setIsDeleting(false),
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

    function handleRemoveImage() {
        setIsDeleting(true);
        deleteImageMutation.mutate();
    }

    return { handleFileSelected, handleRemoveImage, isUploading, isDeleting };
}
"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Camera, Check, Loader2, X } from "lucide-react";
import { updateStudentProfile } from "@/lib/actions/profileActions";
import { StudentIdentity } from "@/types/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useProfileImageUpload } from "@/app/hooks/useProfileImageUpload";

interface ProfileHeaderEditFormProps {
    identity: StudentIdentity;
    queryKey: unknown[];
    onDone: () => void;
}

export default function ProfileHeaderEditForm({ identity, queryKey, onDone, }: ProfileHeaderEditFormProps) {
    const queryClient = useQueryClient();
    const [name, setName] = useState(identity.name);
    const [institution, setInstitution] = useState(identity.institution);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { handleFileSelected, isUploading } = useProfileImageUpload(queryKey);

    const mutation = useMutation({
        mutationFn: () => updateStudentProfile({ name, institution }),
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Profile updated");
                queryClient.invalidateQueries({ queryKey });
                onDone();
            } else { setError(result.error); }
        },
        onError: () => setError("Failed to save changes"),
    });

    function handleSave() {
        setError(null);
        if (!name.trim() || !institution.trim()) {
            setError("Name and institution are required");
            return;
        }
        mutation.mutate();
    }

    function handleAvatarClick() { fileInputRef.current?.click(); }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleFileSelected(file);
        e.target.value = ""; // allow re-selecting the same file later
    }

    return (
        <div className="rounded-xl border border-[#DAD7CE] bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-[#1C2420]">Edit Profile</h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onDone} disabled={mutation.isPending}><X size={14} className="mr-1" /> Cancel</Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        className="bg-[#1F6F5C] hover:bg-[#175446] text-white"
                    >
                        <Check size={14} className="mr-1" />
                        {mutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="flex items-start gap-6">
                <div className="relative shrink-0">
                    <div className="h-16 w-16 rounded-full bg-[#DAD7CE] overflow-hidden">
                        {identity.image ? (
                            <Image src={identity.image} alt={identity.name} height={40} width={40} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-[#6B7369] text-lg font-medium">
                                {identity.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        onClick={handleAvatarClick}
                        disabled={isUploading}
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#1F6F5C] text-white flex items-center justify-center border-2 border-white disabled:opacity-60"
                        title="Change photo"
                    >
                        {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                    </button>
                </div>

                <div className="flex-1 space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#1C2420]">Full Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[#1C2420]">Institution</label>
                        <Input value={institution} onChange={(e) => setInstitution(e.target.value)} />
                    </div>
                    {error && <p className="text-sm text-[#C1443D]">{error}</p>}
                </div>
            </div>
        </div>
    );
}
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { TeacherIdentity } from "@/types/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfileImageUpload } from "@/app/hooks/useProfileImageUpload";
import { updateTeacherProfile, } from "@/lib/actions/profileActions";
import TeacherProfileHeaderEditFields from "./TeacherProfileHeaderEditFields";

interface TeacherProfileHeaderEditFormProps {
    identity: TeacherIdentity;
    queryKey: unknown[];
    onDone: () => void;
}

const phonePattern = /^(?:\+?880|0)1[3-9]\d{8}$/;

export default function TeacherProfileHeaderEditForm({ identity, queryKey, onDone, }: TeacherProfileHeaderEditFormProps) {
    const queryClient = useQueryClient();
    const [name, setName] = useState(identity.name);
    const [institution, setInstitution] = useState(identity.institution);
    const [phoneNumber, setPhoneNumber] = useState(identity.phoneNumber ?? "");
    const [error, setError] = useState<string | null>(null);
    const { handleFileSelected, isUploading } = useProfileImageUpload(queryKey);

    const mutation = useMutation({
        mutationFn: () => updateTeacherProfile({ name, institution, phoneNumber  }),
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
        const cleanedPhone = phoneNumber.replace(/[\s\-]/g, "");
        if (!phonePattern.test(cleanedPhone)) {
            setError("Enter a valid Bangladeshi phone number");
            return;
        }
        mutation.mutate();
    }

    return (
        <div className="rounded-xl border border-[#DAD7CE] bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-[#1C2420]">Edit Profile</h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onDone} disabled={mutation.isPending}>
                        <X size={14} className="mr-1" /> Cancel
                    </Button>
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

            <TeacherProfileHeaderEditFields
                identity={identity}
                name={name}
                setName={setName}
                institution={institution}
                setInstitution={setInstitution}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                isUploading={isUploading}
                onFileSelected={handleFileSelected}
            />

            {error && <p className="text-sm text-[#C1443D] mt-3">{error}</p>}
        </div>
    );
}
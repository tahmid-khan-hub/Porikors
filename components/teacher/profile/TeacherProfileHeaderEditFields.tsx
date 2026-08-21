"use client";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Camera, Loader2 } from "lucide-react";
import { TeacherIdentity } from "@/types/profile";
import Image from "next/image";

interface TeacherProfileHeaderEditFieldsProps {
    identity: TeacherIdentity;
    name: string;
    setName: (value: string) => void;
    institution: string;
    setInstitution: (value: string) => void;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    isUploading: boolean;
    onFileSelected: (file: File) => void;
}

export default function TeacherProfileHeaderEditFields({ identity, name, setName, institution, setInstitution,
phoneNumber, setPhoneNumber, isUploading, onFileSelected, }: TeacherProfileHeaderEditFieldsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleAvatarClick() { fileInputRef.current?.click(); }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) onFileSelected(file);
        e.target.value = "";
    }

    return (
        <div className="flex items-start gap-6">
            <div className="relative shrink-0">
                <div className="h-16 w-16 rounded-full bg-[#DAD7CE] overflow-hidden">
                    {identity.image ? (
                        <Image src={identity.image} alt={identity.name} height={64} width={64} className="h-full w-full object-cover" />
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
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1C2420]">Phone Number</label>
                    <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="01XXXXXXXXX" />
                </div>
                <p className="text-xs text-[#8A9186]">Date of birth and gender cannot be changed. Contact an admin if this information is incorrect.</p>
            </div>
        </div>
    );
}
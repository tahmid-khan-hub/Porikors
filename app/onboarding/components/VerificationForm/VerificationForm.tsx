"use client"
import { useMutation } from "@tanstack/react-query";
import { submitVerification } from "@/lib/actions/submitVerification";
import { ArrowLeft } from "lucide-react";
import { clearOnboardingStorage, clearStoredFields } from "@/lib/onboardingStorage";
import { useState } from "react";
import { Role } from "../OnBoardingClientSide";
import VerificationFormFields from "./VerificationFormFields";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface VerificationFormProps {
    role: Role;
    onBack: () => void;
}

export default function VerificationForm({ role, onBack } : VerificationFormProps) {
    const { update } = useSession();
    const router = useRouter();
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [formKey, setFormKey] = useState(0);

    const mutation = useMutation({
        mutationFn: (formData: FormData) => submitVerification(role, formData),
        onSuccess: () => {
            clearOnboardingStorage();
            update({ role, roleStatus: "pending" });
            router.push("/pending")
        },
        onError: () => {
            alert("something went wrong. Try again")
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        mutation.mutate(formData);
    }

    function handleClear() {
        clearStoredFields();
        setDepartment("");
        setDesignation("");
        setFormKey((k) => k + 1); 
    }
    return(
        <>
            {/* back button */}
            <button
                onClick={onBack}
                className="flex text-sm text-[#1C2420] font-semibold mb-5"
            >
                <ArrowLeft size={14} className="mr-1 mt-0.75 font-semibold" />Back
            </button>
            <div className="rounded-xl border border-[#DAD7CE] bg-white p-6">
                <h2 className="mt-2 text-xl font-semibold text-[#1C2420] capitalize">{role} verification</h2>
                <p className="mt-1 text-sm text-[#1C2420]/60">We will review this before granting {role} access.</p>

                <VerificationFormFields 
                    role={role}
                    formKey={formKey}
                    department={department}
                    setDepartment={setDepartment}
                    designation={designation}
                    setDesignation={setDesignation}
                    onSubmit={handleSubmit}
                    onClear={handleClear}
                    mutation={mutation} />
            </div>
        </>
    )
}
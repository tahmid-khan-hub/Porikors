"use client"
import { useMutation } from "@tanstack/react-query";
import { submitVerification } from "@/lib/actions/submitVerification";
import { ArrowLeft, XCircle } from "lucide-react";
import { clearOnboardingStorage, clearStoredFields } from "@/lib/onboardingStorage";
import { useState } from "react";
import { Role } from "../OnBoardingClientSide";
import VerificationFormFields from "./VerificationFormFields";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    const [fieldErrors, setFieldErrors] = useState<{ work_email?: string; student_id_number?: string; department?: string; designation?: string; }>({});

    const mutation = useMutation({
        mutationFn: (formData: FormData) => submitVerification(role, formData),
        onSuccess: async() => {
            clearOnboardingStorage();
            await update({ role, roleStatus: "pending" });
            router.push("/pending")
        },
        onError: () => {
            toast.error("Falied to submit for review", {
                description: "Please try again. Something went wrong!",
                descriptionClassName: "!text-[#C1443D]/80",
                icon: <XCircle className="text-[#C1443D]" size={18} />,
            });
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const studentIdPattern = /^\d{3}-\d{3}-\d{3}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errors: typeof fieldErrors = {};
        
        if (role === "student") {
            const studentId = formData.get("student_id_number")?.toString().trim() ?? "";
            if (!studentIdPattern.test(studentId)) errors.student_id_number = "Format must be 232-115-067";
        }
        
        if (role === "teacher") {
            const workEmail = formData.get("work_email")?.toString().trim() ?? "";
            if (!emailPattern.test(workEmail)) errors.work_email = "Enter a valid email address";
            if (!department) errors.department = "Please select a department";
            if (!designation) errors.designation = "Please select a designation";
        }
        
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;
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
                    fieldErrors={fieldErrors}
                    mutation={mutation} />
            </div>
        </>
    )
}
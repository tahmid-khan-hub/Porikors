import { useMutation } from "@tanstack/react-query";
import { Role } from "./OnBoardingClientSide";
import { submitVerification } from "@/lib/actions/submitVerification";
import Field from "./Field";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { clearOnboardingStorage, clearStoredFields } from "@/lib/onboardingStorage";
import Dropdown from "@/components/shared/Dropdown";
import { departmentOptions } from "@/lib/constants/departmentOptions";
import { useState } from "react";
import { designationOptions } from "@/lib/constants/designationOptions";

interface VerificationFormProps {
    role: Role;
    onBack: () => void;
}

export default function VerificationForm({ role, onBack } : VerificationFormProps) {
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [formKey, setFormKey] = useState(0);

    const mutation = useMutation({
        mutationFn: (formData: FormData) => submitVerification(role, formData),
        onSuccess: () => {
            clearOnboardingStorage();
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

                <form key={formKey} onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* institution */}
                    <Field name="institution" placeholder="Enter your institution" label="Institution" required />

                    {role === "teacher" ? (
                        <>
                            {/* fields for teacher role */}
                            <Field name="work_email" placeholder="Enter you work email" label="Email" required />
                            <Dropdown name="department" options={departmentOptions} placeholder="Select your department" label="Department" value={department} onChange={setDepartment} />
                            <Dropdown name="designation" options={designationOptions} placeholder="Select your designation" label="Designation" value={designation} onChange={setDesignation} />
                        </>
                    ) : (
                        <>
                            {/* fields for student role */}
                            <Field name="student_id_number" label="Student ID number" placeholder="Enter your student ID" required />
                            <div>
                                <label className="text-xs font-medium text-[#1C2420]/70">
                                    Student ID card photo
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled
                                    title="Upload coming soon — pending storage setup"
                                    className="mt-1 w-full cursor-not-allowed rounded-lg border border-[#DAD7CE] bg-[#F6F5F1] px-3 py-2 text-sm text-[#1C2420]/40"
                                />
                                <p className="mt-1 text-xs text-[#D98B3F]">
                                    Photo upload is not live yet — you can submit without it for now.
                                </p>
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 mt-8">
                        <Button
                            type="button"
                            onClick={handleClear}
                            variant="outline"
                            className="w-18 rounded-lg border-[#DAD7CE] bg-white text-[#1C2420] hover:bg-[#F6F5F1] py-5"
                        >
                            Clear
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-1 rounded-lg bg-[#1F6F5C] text-white transition-colors hover:bg-[#175446] disabled:opacity-60 py-5"
                        >
                            {mutation.isPending ? "Submitting…" : "Submit for review"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}
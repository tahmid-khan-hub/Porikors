import { useMutation } from "@tanstack/react-query";
import { Role } from "./OnBoardingClientSide";
import { submitVerification } from "@/lib/actions/submitVerification";
import Field from "./Field";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { clearOnboardingStorage } from "@/lib/onboardingStorage";

interface VerificationFormProps {
    role: Role;
    onBack: () => void;
}

export default function VerificationForm({ role, onBack } : VerificationFormProps) {

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

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* institution */}
                    <Field name="institution" label="Institution" required />

                    {role === "teacher" ? (
                        <>
                            {/* fields for teacher role */}
                            <Field name="designation" label="Designation" required />
                            <Field name="department" label="Department" required />
                            <Field name="work_email" label="Work email" type="email" required />
                        </>
                    ) : (
                        <>
                            {/* fields for student role */}
                            <Field name="student_id_number" label="Student ID number" required />
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

                    <Button 
                        type="submit"
                        disabled={mutation.isPending}
                        className={"w-full rounded-lg bg-[#1F6F5C] text-white transition-colors hover:bg-[#175446] disabled:opacity-60 mt-5 py-5"}>
                        {mutation.isPending ? "Submitting…" : "Submit for review"}
                    </Button>
                </form>
            </div>
        </>
    )
}
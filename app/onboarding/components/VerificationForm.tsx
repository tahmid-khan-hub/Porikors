import { useMutation } from "@tanstack/react-query";
import { Role } from "./OnBoardingClientSide";
import { submitVerification } from "@/lib/actions/submitVerification";

interface VerificationFormProps {
    role: Role;
    onBack: () => void;
}

export default function VerificationForm({ role, onBack } : VerificationFormProps) {

    const mutation = useMutation({
        mutationFn: (formData: FormData) => submitVerification(role, formData),
        onSuccess: () => {
            
        },
        onError: () => {
            alert("something went wrong. Try again")
        }
    })
    return(
        <div>

        </div>
    )
}
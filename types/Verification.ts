import { UseMutationResult } from "@tanstack/react-query";
import { Role } from "@/app/onboarding/components/OnBoardingClientSide";
import { submitVerification } from "@/lib/actions/submitVerification";

// derive the resolved return type directly from the server action
type SubmitVerificationResult = Awaited<ReturnType<typeof submitVerification>>;

export interface VerificationFormFieldsProps {
  role: Role;
  formKey: number;
  department: string;
  setDepartment: (value: string) => void;
  designation: string;
  setDesignation: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  mutation: UseMutationResult<SubmitVerificationResult, Error, FormData, unknown>;
}
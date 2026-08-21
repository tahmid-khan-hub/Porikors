import Field from "../Field";
import { Button } from "@/components/ui/button";
import { VerificationFormFieldsProps } from "@/types/Verification";
import TeacherVerificationFormFields from "./TeacherVerificationFormFields";
import StudentVerificationFormFields from "./StudentVerificationFormFields";

export default function VerificationFormFields({role,
  formKey, department, setDepartment, designation, setDesignation,
  gender, setGender, dateOfBirth, setDateOfBirth, onSubmit, onClear, mutation, fieldErrors } : VerificationFormFieldsProps) {
  return (
    <div>
      <form key={formKey} onSubmit={onSubmit} className="mt-6 space-y-4">
        {/* institution */}
        <Field
          name="institution"
          placeholder="Enter your institution"
          label="Institution"
          required
        />

        {role === "teacher" ? (
          <>
            {/* fields for teacher role */}
            <TeacherVerificationFormFields 
              fieldErrors={fieldErrors}
              department={department}
              setDepartment={setDepartment}
              designation={designation}
              setDesignation={setDesignation}
              gender={gender}
              setGender={setGender}
              dateOfBirth={dateOfBirth}
              setDateOfBirth={setDateOfBirth}
            />
          </>
        ) : (
          <>
            {/* fields for student role */}
            <StudentVerificationFormFields 
              fieldErrors={fieldErrors}
              department={department}
              setDepartment={setDepartment}
              gender={gender}
              setGender={setGender}
              dateOfBirth={dateOfBirth}
              setDateOfBirth={setDateOfBirth}
            />
          </>
        )}

        <div className="flex gap-3 mt-8">
          <Button
            type="button"
            onClick={onClear}
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
  );
}

import Dropdown from "@/components/shared/Dropdown";
import Field from "../Field";
import { Button } from "@/components/ui/button";
import { VerificationFormFieldsProps } from "@/types/Verification";
import { departmentOptions } from "@/lib/constants/departmentOptions";
import { designationOptions } from "@/lib/constants/designationOptions";

export default function VerificationFormFields({role,
  formKey, department, setDepartment, designation, setDesignation, onSubmit, onClear, mutation, fieldErrors } : VerificationFormFieldsProps) {
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
            <Field
              name="work_email"
              placeholder="Enter you work email"
              label="Email"
              required
              type="email" error={fieldErrors?.work_email}
            />
            <Dropdown
              name="department"
              options={departmentOptions}
              placeholder="Select your department"
              label="Department"
              value={department}
              onChange={setDepartment}
              error={fieldErrors?.department}
            />
            <Dropdown
              name="designation"
              options={designationOptions}
              placeholder="Select your designation"
              label="Designation"
              value={designation}
              onChange={setDesignation}
              error={fieldErrors?.designation}
            />
          </>
        ) : (
          <>
            {/* fields for student role */}
            <Field
              name="student_id_number"
              label="Student ID number"
              placeholder="e.g. 232-115-057"
              required
              pattern="\d{3}-\d{3}-\d{3}" title="Format: 232-115-067"
              maxLength={11} error={fieldErrors?.student_id_number}
            />
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
                Photo upload is not live yet — you can submit without it for
                now.
              </p>
            </div>
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

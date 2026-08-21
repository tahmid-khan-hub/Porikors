import Dropdown from "@/components/shared/Dropdown";
import Field from "../Field";
import { departmentOptions } from "@/lib/constants/departmentOptions";
import DatePicker from "@/components/shared/DatePicker";

interface StudentVerificationFormFieldsProps {
    fieldErrors?: { student_id_number?: string; phone_number?: string; gender?: string; date_of_birth?: string; department?: string; };
    department: string;
    setDepartment: (value: string) => void;
    gender: string;
    setGender: (value: string) => void;
    dateOfBirth: Date | undefined;
    setDateOfBirth: (value: Date | undefined) => void;
}

const genderOptions = ["Male", "Female"]

export default function StudentVerificationFormFields({ fieldErrors, department, setDepartment, gender, setGender, dateOfBirth, setDateOfBirth, }: StudentVerificationFormFieldsProps) {
    return (
        <>
            <Field
                name="student_id_number"
                label="Student ID number"
                placeholder="e.g. 232-115-057"
                required
                pattern="\d{3}-\d{3}-\d{3}" title="Format: 232-115-057"
                maxLength={11} error={fieldErrors?.student_id_number}
            />
            <Field
                name="phone_number"
                placeholder="Enter your phone number"
                label="Phone number"
                required
                error={fieldErrors?.phone_number}
            />
            <Dropdown
                name="gender"
                options={genderOptions}
                placeholder="Select your gender"
                label="Gender"
                value={gender}
                onChange={setGender}
                error={fieldErrors?.gender}
            />
            <DatePicker
                name="date_of_birth"
                label="Date of Birth"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                placeholder="Select your date of birth"
                error={fieldErrors?.date_of_birth}
                required
            />
            <div>
                <label className="text-xs font-medium text-[#1C2420]/70">Student ID card photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        disabled
                        title="Upload coming soon — pending storage setup"
                        className="mt-1 w-full cursor-not-allowed rounded-lg border border-[#DAD7CE] bg-[#F6F5F1] px-3 py-2 text-sm text-[#1C2420]/40"
                    />
                <p className="mt-1 text-xs text-[#D98B3F]"> Photo upload is not live yet — you can submit without it for now.</p>
            </div>
            <Dropdown
                name="department"
                options={departmentOptions}
                placeholder="Select your department"
                label="Department"
                value={department}
                onChange={setDepartment}
                error={fieldErrors?.department}
            />
        </>
    )
}
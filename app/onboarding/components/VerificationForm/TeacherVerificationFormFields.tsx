import Dropdown from "@/components/shared/Dropdown";
import Field from "../Field";
import { departmentOptions } from "@/lib/constants/departmentOptions";
import { designationOptions } from "@/lib/constants/designationOptions";
import DatePicker from "@/components/shared/DatePicker";

const genderOptions = ["Male", "Female"]

interface TeacherVerificationFormFields {
    fieldErrors?: { work_email?: string; student_id_number?: string; department?: string; designation?: string; phone_number?: string; gender?: string; date_of_birth?: string;};
    department: string;
    setDepartment: (value: string) => void;
    designation: string;
    setDesignation: (value: string) => void;
    gender: string;
    setGender: (value: string) => void;
    dateOfBirth: Date | undefined;
    setDateOfBirth: (value: Date | undefined) => void;
}

export default function TeacherVerificationFormFields({ fieldErrors, department, setDepartment, designation, setDesignation, gender, setGender, dateOfBirth, setDateOfBirth }: TeacherVerificationFormFields) {
    return (
        <>
            <Field
                name="work_email"
                placeholder="Enter you work email"
                label="Email"
                required
                type="email"
                error={fieldErrors?.work_email}
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
    );
}

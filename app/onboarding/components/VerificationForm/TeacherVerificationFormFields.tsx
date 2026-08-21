import Dropdown from "@/components/shared/Dropdown";
import Field from "../Field";
import { departmentOptions } from "@/lib/constants/departmentOptions";
import { designationOptions } from "@/lib/constants/designationOptions";

interface TeacherVerificationFormFields {
    fieldErrors?: { work_email?: string; student_id_number?: string; department?: string; designation?: string; phone_number?: string; gender?: string; date_of_birth?: string;};
    department: string;
    setDepartment: (value: string) => void;
    designation: string;
    setDesignation: (value: string) => void;
}

export default function TeacherVerificationFormFields({ fieldErrors, department, setDepartment, designation, setDesignation }: TeacherVerificationFormFields) {
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

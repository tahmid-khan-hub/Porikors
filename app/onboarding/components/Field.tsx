
interface FieldProps {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
}

export default function Field({ name, label, type = "text", required } : FieldProps) {
    return (
        <div>
            <label htmlFor={name} className="text-xs font-medium text-[#1C2420]/70">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                required={required}
                className="mt-1 w-full rounded-lg border border-[#DAD7CE] bg-white px-3 py-2 text-sm text-[#1C2420] outline-none focus:border-[#1F6F5C]"
            />
        </div>
    )
}
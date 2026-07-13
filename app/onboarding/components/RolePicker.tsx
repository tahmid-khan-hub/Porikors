import { Role } from "./OnBoardingClientSide"

interface RolePickerProps {
    onSelect: (role: Role) => void;
}

export default function RolePicker({ onSelect } : RolePickerProps) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#1C2420]">Who are you?</h1>
            <p className="mt-2 text-sm text-[#1C2420]/60">
                This determines what you can do on Porikors.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
                {(["teacher", "student"] as const).map((r) => (
                <button
                    key={r}
                    onClick={() => onSelect(r)}
                    className="rounded-xl border border-[#DAD7CE] bg-white p-6 text-left transition-colors hover:border-[#1F6F5C] hover:bg-[#1F6F5C]/5"
                >
                    <span className="block text-lg font-medium text-[#1C2420] capitalize">
                    {r}
                    </span>
                    <span className="mt-1 block text-xs text-[#1C2420]/50">
                    {r === "teacher"
                        ? "Create courses, grade work"
                        : "Join courses, submit work"}
                    </span>
                </button>
                ))}
            </div>
        </div>
    )
}
import { ColumnDef } from "@/components/shared/DataTable";
import { Teacher } from "@/types/admin";
import Image from "next/image";

export const TeacherColumns: ColumnDef<Teacher>[] = [
    {
        key: "name",
        header: "Teacher",
        cell: (teacher) => (
            <div className="flex items-center gap-3">
                {teacher.image ? (
                    <Image
                        src={teacher.image}
                        alt={teacher.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    ) : (
                    <div className="h-8 w-8 rounded-full bg-[#1F6F5C]/10 flex items-center justify-center text-[#1F6F5C] text-xs font-medium">
                        {teacher.name?.[0]?.toUpperCase() ?? "T"}
                    </div>
                )}
                <span className="font-medium text-[#1C2420]">{teacher.name}</span>
            </div>
        )
    },
    {
        key: "email",
        header: "Email",
        cell: (teacher) => <span className="text-[#1C2420]/70">{teacher.email}</span>,
    },
    {
        key: "roleApprovedAt",
        header: "Joined",
        cell: (teacher) => (
            <span className="text-[#1C2420]/70">
                {new Date(teacher.roleApprovedAt).toLocaleDateString()}
            </span>
        ),
    },
]
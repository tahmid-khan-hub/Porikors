import { ColumnDef } from "@/components/shared/DataTable";
import { Student } from "@/types/admin";
import Image from "next/image";

export const StudentColumns: ColumnDef<Student>[] = [
  {
    key: "name",
    header: "Student",
    cell: (student) => (
      <div className="flex items-center gap-3">
        {student.image ? (
          <Image
            src={student.image}
            alt={student.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#1F6F5C]/10 flex items-center justify-center text-[#1F6F5C] text-xs font-medium">
            {student.name?.[0]?.toUpperCase() ?? "S"}
          </div>
        )}
        <span className="font-medium text-[#1C2420]">{student.name}</span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    cell: (student) => (
      <span className="text-[#1C2420]/70">{student.email}</span>
    ),
  },
  {
    key: "roleApprovedAt",
    header: "Joined",
    cell: (student) => (
      <span className="text-[#1C2420]/70">
        {new Date(student.roleApprovedAt).toLocaleDateString()}
      </span>
    ),
  },
];

"use client";
import { useQuery } from "@tanstack/react-query";
import RecordDetailDialog from "@/components/shared/RecordDetailDialog";
import { fetchTeacherDetail } from "@/lib/api/fetchTeacherAndStudentDetail";
import { formatDob } from "@/lib/formatDateOfBirth";

interface TeacherDetailDialogProps {
    teacherId: string | null;
    teacherName: string;
    onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (value === null || value === undefined || value === "") return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-[#1C2420]/50">{label}</span>
            <span className="text-sm text-[#1C2420]">{value}</span>
        </div>
    );
}

export default function TeacherDetailDialog({ teacherId, teacherName, onOpenChange }: TeacherDetailDialogProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["teacher-detail", teacherId],
        queryFn: () => fetchTeacherDetail(teacherId as string),
        enabled: !!teacherId,
    });

    return (
        <RecordDetailDialog
            open={!!teacherId}
            onOpenChange={onOpenChange}
            title={teacherId ? `Teacher — ${teacherName}` : ""}
        >
        {isLoading && (
            <div className="grid grid-cols-2 gap-4 py-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-8 rounded bg-[#DAD7CE]/40 animate-pulse" />
                ))}
            </div>
        )}

        {isError && (
            <p className="text-sm text-[#C1443D] py-4">Failed to load teacher details.</p>
        )}

        {data && (
            <div className="grid grid-cols-2 gap-4 py-2">
                <DetailRow label="Email" value={data.email} />
                <DetailRow label="Phone number" value={data.phoneNumber} />
                <DetailRow label="Gender" value={data.gender} />
                <DetailRow label="Date of birth" value={formatDob(data.dateOfBirth)} />
                <DetailRow label="Institution" value={data.institution} />
                <DetailRow label="Department" value={data.department} />
                <DetailRow label="Designation" value={data.designation} />
                <DetailRow label="Work email" value={data.workEmail} />
                <DetailRow label="Courses taught" value={data.coursesCount} />
                <DetailRow label="Joined" value={new Date(data.roleApprovedAt).toLocaleDateString()} />
            </div>
        )}
        </RecordDetailDialog>
    );
}
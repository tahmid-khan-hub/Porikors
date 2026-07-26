"use client"
import { StudentColumns } from "@/components/admin/students/StudentColumns";
import StudentStatsCards from "@/components/admin/students/StudentStatsCards";
import { DataTable } from "@/components/shared/DataTable";
import DataTablePagination from "@/components/shared/DataTablePagination";
import Filters from "@/components/shared/Filters";
import { adminFetchStudents } from "@/lib/api/adminFetchStudents";
import { DATE_OPTIONS, SORT_OPTIONS } from "@/lib/constants/filterOptions";
import { StudentDateRange, StudentSortBy } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminStudentsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const sortBy = (searchParams.get("sortBy") as StudentSortBy) || "newest";
    const dateRange = (searchParams.get("dateRange") as StudentDateRange) || "all";
    const search = searchParams.get("search") || "";

    function updateParams(next: { page?: number; sortBy?: StudentSortBy; dateRange?: StudentDateRange; search?: string; }) {
        const params = new URLSearchParams(searchParams.toString());

        if (next.page !== undefined) params.set("page", String(next.page));
        if (next.sortBy !== undefined) params.set("sortBy", next.sortBy);
        if (next.dateRange !== undefined) params.set("dateRange", next.dateRange);
        if (next.search !== undefined) {
            if (next.search) params.set("search", next.search);
            else params.delete("search"); 
        }
        router.push(`/admin/students?${params.toString()}`);
    }

    const queryParams = { page, sortBy, dateRange, search };
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["admin", "students", queryParams],
        queryFn: () => adminFetchStudents(queryParams),
        placeholderData: (prev) => prev,
    })

    const pagination = data?.pagination ?? { page: 1, limit: 10, totalItems: 0, totalPages: 1 };
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[#1C2420]">Students</h1>
                <p className="text-[#1C2420]/60 mt-1">Manage all verified students on the platform.</p>
            </div>

            <StudentStatsCards />

            <Filters
                search={search}
                onSearchChange={(value) => updateParams({ search: value, page: 1 })}
                searchPlaceholder="Search students by name or email..."
                groups={[
                    {
                        key: "sortBy",
                        label: "Sort by",
                        options: SORT_OPTIONS,
                        value: sortBy,
                        onChange: (value) => updateParams({ sortBy: value as StudentSortBy, page: 1 }),
                    },
                    {
                        key: "dateRange",
                        label: "Joined",
                        options: DATE_OPTIONS,
                        value: dateRange,
                        onChange: (value) => updateParams({ dateRange: value as StudentDateRange, page: 1 }),
                    },
                ]}
            />

            <DataTable
                columns={StudentColumns}
                data={data?.students ?? []}
                isLoading={isLoading || isFetching}
                getRowId={(student) => student.id}
                emptyMessage="No students found."
            />
            <DataTablePagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                onPageChange={(newPage) => updateParams({ page: newPage })}
                itemLabel="students"
            />
        </div>
    )
}
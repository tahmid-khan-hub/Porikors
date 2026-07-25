"use client";
import TeacherFilters from "@/components/admin/teachers/TeacherFilters";
import TeacherStatsCards from "@/components/admin/teachers/TeacherStatsCards";
import { DataTable } from "@/components/shared/DataTable";
import DataTablePagination from "@/components/shared/DataTablePagination";
import { TeacherDateRange, TeacherSortBy } from "@/types/admin";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminTeachersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const sortBy = (searchParams.get("sortBy") as TeacherSortBy) || "newest";
    const dateRange = (searchParams.get("dateRange") as TeacherDateRange) || "all";

    function updateParams (next: { page?: number; sortBy?: TeacherSortBy; dateRange?: TeacherDateRange }) {
        const params = new URLSearchParams(searchParams.toString())

        if (next.page !== undefined) params.set("page", String(next.page));
        if (next.sortBy !== undefined) params.set("sortBy", next.sortBy);
        if (next.dateRange !== undefined) params.set("dateRange", next.dateRange);

        router.push(`/admin/teachers?${params.toString()}`);
    }
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-[#1C2420]">Teachers</h1>
                <p className="text-sm text-[#1C2420]/60">Manage all verified teachers on the platform.</p>
            </div>

            <TeacherStatsCards />

            <TeacherFilters
                sortBy={sortBy}
                dateRange={dateRange}
                onSortByChange={(value) => updateParams({ sortBy: value, page: 1 })}
                onDateRangeChange={(value) => updateParams({ dateRange: value, page: 1 })}
            />

            <DataTable
                columns={teacherColumns}
                data={data?.teachers ?? []}
                isLoading={isLoading || isFetching}
                getRowId={(teacher) => teacher.id}
                emptyMessage="No teachers found."
            />

            <DataTablePagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                onPageChange={(newPage) => updateParams({ page: newPage })}
                itemLabel="teachers"
            />
        </div>
    )
}
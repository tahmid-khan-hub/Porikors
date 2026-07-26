"use client";
import { TeacherColumns } from "@/components/admin/teachers/TeacherColumns";
import TeacherFilters from "@/components/admin/teachers/TeacherFilters";
import TeacherStatsCards from "@/components/admin/teachers/TeacherStatsCards";
import { DataTable } from "@/components/shared/DataTable";
import DataTablePagination from "@/components/shared/DataTablePagination";
import { adminFetchTeachers } from "@/lib/api/adminFetchTeachers";
import { TeacherDateRange, TeacherSortBy } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminTeachersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const sortBy = (searchParams.get("sortBy") as TeacherSortBy) || "newest";
    const dateRange = (searchParams.get("dateRange") as TeacherDateRange) || "all";
    const search = searchParams.get("search") || "";

    function updateParams (next: { page?: number; sortBy?: TeacherSortBy; dateRange?: TeacherDateRange; search?: string; }) {
        const params = new URLSearchParams(searchParams.toString())

        if (next.page !== undefined) params.set("page", String(next.page));
        if (next.sortBy !== undefined) params.set("sortBy", next.sortBy);
        if (next.dateRange !== undefined) params.set("dateRange", next.dateRange);
        if (next.search !== undefined) {
            if (next.search) params.set("search", next.search);
            else params.delete("search"); 
        }

        router.push(`/admin/teachers?${params.toString()}`);
    }

    const queryParams = { page, sortBy, dateRange, search };

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["admin", "teachers", queryParams],
        queryFn: () => adminFetchTeachers(queryParams),
        placeholderData: (prev) => prev,
    });

    const pagination = data?.pagination ?? { page: 1, limit: 10, totalItems: 0, totalPages: 1 };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-[#1C2420]">Teachers</h1>
                <p className="text-[#1C2420]/60 mt-1">Manage all verified teachers on the platform.</p>
            </div>

            <TeacherStatsCards />

            <TeacherFilters
                search={search}
                sortBy={sortBy}
                dateRange={dateRange}
                onSearchChange={(value) => updateParams({ search: value, page: 1 })}
                onSortByChange={(value) => updateParams({ sortBy: value, page: 1 })}
                onDateRangeChange={(value) => updateParams({ dateRange: value, page: 1 })}
            />

            <DataTable
                columns={TeacherColumns}
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
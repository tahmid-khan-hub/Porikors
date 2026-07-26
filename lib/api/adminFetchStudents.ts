import { StudentDateRange, StudentSortBy, StudentsResponse } from "@/types/admin";

interface UseStudentsParams {
  page: number;
  limit?: number;
  sortBy?: StudentSortBy;
  dateRange?: StudentDateRange;
  search?: string;
}

export async function adminFetchStudents(params: UseStudentsParams): Promise<StudentsResponse> {
    const query = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit ?? 10),
        sortBy: params.sortBy ?? "newest",
        dateRange: params.dateRange ?? "all",
        ...(params.search ? { search: params.search } : {}),
    });

    const res = await fetch(`/api/admin/students?${query.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to load students");
    return data as StudentsResponse;
}
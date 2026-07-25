import { TeacherDateRange, TeacherSortBy, TeachersResponse } from "@/types/admin";

interface UseTeachersParams {
  page: number;
  limit?: number;
  sortBy?: TeacherSortBy;
  dateRange?: TeacherDateRange;
  search?: string;
}

export async function adminFetchTeachers(params: UseTeachersParams): Promise<TeachersResponse> {
    const query = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit ?? 10),
        sortBy: params.sortBy ?? "newest",
        dateRange: params.dateRange ?? "all",
        ...(params.search ? { search: params.search } : {}),
    });

    const res = await fetch(`/api/admin/teachers?${query.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to load teachers");
    return data as TeachersResponse;
}
import { RoleTab, VerificationsPage } from "@/types/AdminVerification";

export async function fetchVerifications(
  role: RoleTab,
  cursor: string | null
): Promise<VerificationsPage> {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (cursor) params.set("cursor", cursor);

    const res = await fetch(`/api/admin/verifications?${params.toString()}`)
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message ?? "Failed to load verifications");

    return { items: data.items, nextCursor: data.nextCursor }; 
}

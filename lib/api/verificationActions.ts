export async function approveVerification(id: string) {
    const res = await fetch(`/api/admin/verifications/${id}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message ?? "Failed to approve");
    return data;
}

export async function rejectVerification(id: string, reason: string) {
    const res = await fetch(`/api/admin/verifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message ?? "Failed to reject");
    return data;
}

export function formatDob(dob: string | Date | null) {
    if (!dob) return null;
    const date = new Date(dob);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}